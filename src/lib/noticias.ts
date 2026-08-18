import type { RowDataPacket } from 'mysql2'
import { getPool } from './db'

export interface Noticia {
  titulo: string
  imagen_destacada: string
  fecha: Date
  extracto: string
  slug: string
  contenido: string
}

interface NoticiaRow extends RowDataPacket {
  titulo: string
  slug: string
  imagenDestacadaUrl: string
  fecha: Date
  extracto: string
  contenido: string
}

function mapRow(row: NoticiaRow): Noticia {
  return {
    titulo: row.titulo,
    imagen_destacada: row.imagenDestacadaUrl,
    fecha: row.fecha,
    extracto: row.extracto,
    slug: row.slug,
    contenido: row.contenido,
  }
}

const SELECT_NOTICIA = 'SELECT titulo, slug, imagenDestacadaUrl, fecha, extracto, contenido FROM `Noticia`'

export async function getAllNoticias(): Promise<Noticia[]> {
  const pool = getPool()
  const [rows] = await pool.query<NoticiaRow[]>(
    `${SELECT_NOTICIA} WHERE estado = 'publicado' ORDER BY fecha DESC`
  )
  return rows.map(mapRow)
}

export async function getNoticia(slug: string): Promise<Noticia | null> {
  const pool = getPool()
  const [rows] = await pool.query<NoticiaRow[]>(
    `${SELECT_NOTICIA} WHERE slug = ? AND estado = 'publicado' LIMIT 1`,
    [slug]
  )
  return rows[0] ? mapRow(rows[0]) : null
}
