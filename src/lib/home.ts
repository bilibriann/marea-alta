import path from 'path'
import fs from 'fs/promises'

export interface HomeContent {
  hero: {
    badge: string
    titulo: string
    subtitulo: string
    cta: string
    ctaHref: string
    ctaSecundario: string
    ctaSecundarioHref: string
  }
  confianza: {
    titulo: string
    items: {
      icono: 'snowflake' | 'history' | 'verified' | 'globe'
      titulo: string
      descripcion: string
    }[]
  }
  nosotros: {
    titulo: string
    descripcion: string
    fundacion: number
  }
  mision: string
  vision: string
  valores: string[]
}

export interface Sector {
  slug: string
  nombre: string
  descripcion: string
  imagen: string
}

export interface Testimonio {
  nombre: string
  cargo: string
  empresa: string
  testimonio: string
}

export interface Certificacion {
  nombre: string
  descripcion: string
  imagen: string
  organismo: string
}

export async function getHomeContent(): Promise<HomeContent> {
  const raw = await fs.readFile(
    path.join(process.cwd(), 'src/content/home.json'),
    'utf8'
  )
  return JSON.parse(raw) as HomeContent
}

export async function getSectores(): Promise<Sector[]> {
  const raw = await fs.readFile(
    path.join(process.cwd(), 'src/content/sectores.json'),
    'utf8'
  )
  return JSON.parse(raw) as Sector[]
}

export async function getTestimonios(): Promise<Testimonio[]> {
  const raw = await fs.readFile(
    path.join(process.cwd(), 'src/content/testimonios.json'),
    'utf8'
  )
  return JSON.parse(raw) as Testimonio[]
}

export async function getCertificaciones(): Promise<Certificacion[]> {
  const raw = await fs.readFile(
    path.join(process.cwd(), 'src/content/certificaciones.json'),
    'utf8'
  )
  return JSON.parse(raw) as Certificacion[]
}
