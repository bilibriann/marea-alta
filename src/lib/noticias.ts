import path from 'path'
import fs from 'fs/promises'
import matter from 'gray-matter'
import { z } from 'zod'

const noticiaFrontmatterSchema = z.object({
  titulo: z.string().min(1),
  imagen_destacada: z.string().min(1),
  fecha: z.coerce.date(),
  extracto: z.string().min(1),
  // Opcionales: una noticia sin ellos usa el título y el extracto. El CMS puede
  // guardar campos vacíos como "" o null, que cuentan como ausentes.
  /** Logo o imagen secundaria que se muestra antes del título. */
  logo: z.string().nullish(),
  /** Título completo para buscadores, tal cual (sin sufijo automático). Si falta se usa el titular. */
  meta_titulo: z.string().nullish(),
  /** Descripción para buscadores; si falta se usa el extracto. */
  meta_descripcion: z.string().nullish(),
  palabras_clave: z.array(z.string()).nullish(),
})

export interface Noticia extends z.infer<typeof noticiaFrontmatterSchema> {
  slug: string
  contenido: string
}

const noticiasDir = path.join(process.cwd(), 'src/content/noticias')

// El slug sale del nombre del archivo, pero siempre en ASCII: si el panel
// guarda "cómo-…-frío.md", la URL queda /noticias/como-…-frio. Una URL con
// tildes da 404 en Hostinger.
function slugDesdeArchivo(file: string): string {
  return file
    .replace(/\.md$/, '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-|-$/g, '')
}

function parseNoticia(file: string, raw: string): Noticia {
  const { data, content } = matter(raw)
  try {
    const frontmatter = noticiaFrontmatterSchema.parse(data)
    return { ...frontmatter, slug: slugDesdeArchivo(file), contenido: content.trim() }
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
  // Se busca en el listado y no por nombre de archivo: el slug ya no tiene
  // por qué coincidir letra a letra con el archivo (ver slugDesdeArchivo).
  const noticias = await getAllNoticias()
  return noticias.find((n) => n.slug === slug) ?? null
}
