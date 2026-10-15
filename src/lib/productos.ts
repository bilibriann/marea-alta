import path from 'path'
import fs from 'fs/promises'
import matter from 'gray-matter'
import { z } from 'zod'

// Sveltia CMS guarda un campo opcional vacío como '' en vez de omitirlo,
// lo que rompe .optional() (espera undefined, no un string vacío). Se
// normaliza '' a undefined antes de validar.
const optionalString = (schema: z.ZodString | z.ZodURL) =>
  z.preprocess((v) => (v === '' ? undefined : v), schema.optional())

// Sveltia permite agregar una fila a una lista y dejarla en blanco; se
// descarta en vez de romper el build.
const filteredStringList = () =>
  z.preprocess(
    (v) => (Array.isArray(v) ? v.filter((item) => item !== '') : v),
    z.array(z.string().min(1)).default([])
  )

const opcionGrupoSchema = z.object({
  titulo_grupo: z.string().min(1),
  opciones: z.array(z.string().min(1)).min(1),
})

// Igual que arriba: una fila de "Agregar grupo" dejada a medias no debe
// romper el build, se descarta el grupo incompleto.
const grupoOpcionesListSchema = z.preprocess((v) => {
  if (!Array.isArray(v)) return v
  return v
    .map((grupo) => {
      if (typeof grupo !== 'object' || grupo === null) return grupo
      const g = grupo as Record<string, unknown>
      const opciones = Array.isArray(g.opciones)
        ? g.opciones.filter((o) => o !== '')
        : g.opciones
      return { ...g, opciones }
    })
    .filter((grupo) => {
      const g = grupo as Record<string, unknown>
      return (
        typeof g.titulo_grupo === 'string' &&
        g.titulo_grupo !== '' &&
        Array.isArray(g.opciones) &&
        g.opciones.length > 0
      )
    })
}, z.array(opcionGrupoSchema).default([]))

const fichaSchema = z.object({
  // El PDF vive en public/, así que la ruta empieza en / (ej: /fichas/x.pdf).
  archivo: z
    .string()
    .min(1)
    .refine((v) => v.startsWith('/'), {
      message: 'La ficha debe ser una ruta dentro de public/, empezando por "/" (ej: /fichas/producto.pdf)',
    }),
  /** Distingue una ficha de otra cuando el producto tiene varias. */
  etiqueta: optionalString(z.string().min(1)),
})

const productoFrontmatterSchema = z.object({
  nombre: z.string().min(1),
  subtitulo: optionalString(z.string().min(1)),
  galeria: filteredStringList(),
  grupos_opciones: grupoOpcionesListSchema,
  nota_adicional: optionalString(z.string().min(1)),
  opciones_cantidad: filteredStringList(),
  video_youtube: optionalString(z.url()),
  // Un producto puede documentarse con más de una ficha: el mismo artículo tiene
  // fichas separadas por formato (20x28 y 23x29) o por envase (impreso y
  // metalizado). La etiqueta es lo que distingue un botón de descarga del otro.
  fichas: z.array(fichaSchema).default([]),
})

export type OpcionGrupo = z.infer<typeof opcionGrupoSchema>
export type Ficha = z.infer<typeof fichaSchema>

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
