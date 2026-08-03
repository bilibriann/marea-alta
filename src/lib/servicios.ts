import path from 'path'
import fs from 'fs/promises'
import matter from 'gray-matter'

export interface Servicio {
  slug: string
  titulo: string
  resumen: string
  descripcion: string
  imagen: string
  beneficios: string[]
  orden: number
}

const serviciosDir = path.join(process.cwd(), 'src/content/servicios')

export async function getAllServicios(): Promise<Servicio[]> {
  const files = await fs.readdir(serviciosDir)
  const servicios = await Promise.all(
    files
      .filter((f) => f.endsWith('.md'))
      .map(async (file) => {
        const raw = await fs.readFile(path.join(serviciosDir, file), 'utf8')
        const { data } = matter(raw)
        return data as Servicio
      })
  )
  return servicios.sort((a, b) => a.orden - b.orden)
}

export async function getServicio(slug: string): Promise<Servicio | null> {
  try {
    const raw = await fs.readFile(path.join(serviciosDir, `${slug}.md`), 'utf8')
    const { data } = matter(raw)
    return data as Servicio
  } catch {
    return null
  }
}
