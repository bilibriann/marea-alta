import path from 'path'
import fs from 'fs/promises'
import matter from 'gray-matter'
import { z } from 'zod'

const noticiaFrontmatterSchema = z.object({
  titulo: z.string().min(1),
  imagen_destacada: z.string().min(1),
  fecha: z.coerce.date(),
  extracto: z.string().min(1),
})

export interface Noticia extends z.infer<typeof noticiaFrontmatterSchema> {
  slug: string
  contenido: string
}

const noticiasDir = path.join(process.cwd(), 'src/content/noticias')

function parseNoticia(file: string, raw: string): Noticia {
  const { data, content } = matter(raw)
  try {
    const frontmatter = noticiaFrontmatterSchema.parse(data)
    return { ...frontmatter, slug: file.replace(/\.md$/, ''), contenido: content.trim() }
  } catch (err) {
    throw new Error(
      `Noticia inválida en src/content/noticias/${file}: ${err instanceof Error ? err.message : String(err)}`
    )
  }
}

export async function getAllNoticias(): Promise<Noticia[]> {
  // Sin noticias publicadas el directorio queda vacío, y git no versiona
  // carpetas vacías: en un clon limpio `noticiasDir` puede no existir y el
  // readdir tumbaría el build entero. Un listado vacío es la respuesta correcta.
  let files: string[]
  try {
    files = await fs.readdir(noticiasDir)
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return []
    throw err
  }
  const noticias = await Promise.all(
    files
      .filter((f) => f.endsWith('.md'))
      .map(async (file) => {
        const raw = await fs.readFile(path.join(noticiasDir, file), 'utf8')
        return parseNoticia(file, raw)
      })
  )
  return noticias.sort((a, b) => b.fecha.getTime() - a.fecha.getTime())
}

export async function getNoticia(slug: string): Promise<Noticia | null> {
  const file = `${slug}.md`
  try {
    const raw = await fs.readFile(path.join(noticiasDir, file), 'utf8')
    return parseNoticia(file, raw)
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return null
    throw err
  }
}
