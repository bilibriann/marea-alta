import path from 'path'
import fs from 'fs/promises'
import { z } from 'zod'
import type { RowDataPacket } from 'mysql2'
import { getPool } from './db'

export interface OpcionGrupo {
  titulo_grupo: string
  opciones: string[]
}

export interface Producto {
  nombre: string
  subtitulo?: string
  galeria: string[]
  grupos_opciones: OpcionGrupo[]
  nota_adicional?: string
  opciones_cantidad: string[]
  video_youtube?: string
  slug: string
}

const productosContentSchema = z.object({
  titulo: z.string().min(1),
  descripcion: z.string().min(1),
})

export type ProductosContent = z.infer<typeof productosContentSchema>

export async function getProductosContent(): Promise<ProductosContent> {
  const raw = await fs.readFile(path.join(process.cwd(), 'src/content/productos.json'), 'utf8')
  return productosContentSchema.parse(JSON.parse(raw))
}

interface ProductoRow extends RowDataPacket {
  id: number
  nombre: string
  slug: string
  subtitulo: string | null
  notaAdicional: string | null
  videoYoutubeUrl: string | null
  cantidadesParaCotizar: unknown
}

interface ImagenRow extends RowDataPacket {
  productoId: number
  url: string
}

interface GrupoRow extends RowDataPacket {
  productoId: number
  tituloGrupo: string
  opciones: unknown
}

/** MySQL suele devolver columnas JSON ya parseadas, pero según driver/versión
 * a veces llegan como string — cubrimos ambos casos. */
function parseJson<T>(value: unknown): T {
  return typeof value === 'string' ? JSON.parse(value) : (value as T)
}

async function ensamblarProductos(rows: ProductoRow[]): Promise<Producto[]> {
  if (rows.length === 0) return []

  const pool = getPool()
  const ids = rows.map((r) => r.id)

  const [imagenes] = await pool.query<ImagenRow[]>(
    'SELECT productoId, url FROM `ImagenProducto` WHERE productoId IN (?) ORDER BY orden ASC',
    [ids]
  )
  const [grupos] = await pool.query<GrupoRow[]>(
    'SELECT productoId, tituloGrupo, opciones FROM `GrupoOpciones` WHERE productoId IN (?) ORDER BY orden ASC',
    [ids]
  )

  return rows.map((row) => ({
    nombre: row.nombre,
    subtitulo: row.subtitulo ?? undefined,
    galeria: imagenes.filter((i) => i.productoId === row.id).map((i) => i.url),
    grupos_opciones: grupos
      .filter((g) => g.productoId === row.id)
      .map((g) => ({ titulo_grupo: g.tituloGrupo, opciones: parseJson<string[]>(g.opciones) })),
    nota_adicional: row.notaAdicional ?? undefined,
    opciones_cantidad: parseJson<string[]>(row.cantidadesParaCotizar),
    video_youtube: row.videoYoutubeUrl ?? undefined,
    slug: row.slug,
  }))
}

const SELECT_PRODUCTO =
  'SELECT id, nombre, slug, subtitulo, notaAdicional, videoYoutubeUrl, cantidadesParaCotizar FROM `Producto`'

export async function getAllProductos(): Promise<Producto[]> {
  const pool = getPool()
  const [rows] = await pool.query<ProductoRow[]>(`${SELECT_PRODUCTO} WHERE estado = 'publicado'`)
  const productos = await ensamblarProductos(rows)
  return productos.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))
}

export async function getProducto(slug: string): Promise<Producto | null> {
  const pool = getPool()
  const [rows] = await pool.query<ProductoRow[]>(
    `${SELECT_PRODUCTO} WHERE slug = ? AND estado = 'publicado' LIMIT 1`,
    [slug]
  )
  const productos = await ensamblarProductos(rows)
  return productos[0] ?? null
}
