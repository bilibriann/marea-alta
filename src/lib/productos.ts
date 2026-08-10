import path from 'path'
import fs from 'fs/promises'
import matter from 'gray-matter'
import { z } from 'zod'

const opcionGrupoSchema = z.object({
  titulo_grupo: z.string().min(1),
  opciones: z.array(z.string().min(1)).min(1),
})

const productoFrontmatterSchema = z.object({
  nombre: z.string().min(1),
  subtitulo: z.string().min(1).optional(),
  galeria: z.array(z.string().min(1)).default([]),
  grupos_opciones: z.array(opcionGrupoSchema).default([]),
  nota_adicional: z.string().min(1).optional(),
  opciones_cantidad: z.array(z.string().min(1)).default([]),
  video_youtube: z.url().optional(),
})

export type OpcionGrupo = z.infer<typeof opcionGrupoSchema>

export interface Producto extends z.infer<typeof productoFrontmatterSchema> {
  slug: string
}

const productosContentSchema = z.object({
  titulo: z.string().min(1),
  descripcion: z.string().min(1),
})

export type ProductosContent = z.infer<typeof productosContentSchema>

const productosDir = path.join(process.cwd(), 'src/content/productos')

export async function getProductosContent(): Promise<ProductosContent> {
  const raw = await fs.readFile(
    path.join(process.cwd(), 'src/content/productos.json'),
    'utf8'
  )
  return productosContentSchema.parse(JSON.parse(raw))
}

function parseProducto(file: string, raw: string): Producto {
  const { data } = matter(raw)
  try {
    const frontmatter = productoFrontmatterSchema.parse(data)
    return { ...frontmatter, slug: file.replace(/\.md$/, '') }
  } catch (err) {
    throw new Error(
      `Producto inválido en src/content/productos/${file}: ${err instanceof Error ? err.message : String(err)}`
    )
  }
}

export async function getAllProductos(): Promise<Producto[]> {
  const files = await fs.readdir(productosDir)
  const productos = await Promise.all(
    files
      .filter((f) => f.endsWith('.md'))
      .map(async (file) => {
        const raw = await fs.readFile(path.join(productosDir, file), 'utf8')
        return parseProducto(file, raw)
      })
  )
  return productos.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))
}

export async function getProducto(slug: string): Promise<Producto | null> {
  const file = `${slug}.md`
  try {
    const raw = await fs.readFile(path.join(productosDir, file), 'utf8')
    return parseProducto(file, raw)
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return null
    throw err
  }
}
