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
  proposito: {
    eyebrow: string
    titulo: string
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

/**
 * Marcas fabricadas por Marea Alta. `orden` manda el renderizado y va de 10 en
 * 10: reordenar la grilla es cambiar un número en marcas-propias.json, sin
 * renumerar el resto ni tocar un componente.
 */
export interface MarcaPropia {
  slug: string
  nombre: string
  logo: string
  alt: string
  orden: number
  url?: string
}

/** Marca de terceros que Marea Alta distribuye. Otra forma, otra sección. */
export interface Distribucion {
  nombre: string
  logo: string
  alt: string
  url: string
  descripcion: string
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

export async function getMarcasPropias(): Promise<MarcaPropia[]> {
  const raw = await fs.readFile(
    path.join(process.cwd(), 'src/content/marcas-propias.json'),
    'utf8'
  )
  const marcas = JSON.parse(raw) as MarcaPropia[]
  return marcas.sort((a, b) => a.orden - b.orden)
}

export async function getDistribucion(): Promise<Distribucion> {
  const raw = await fs.readFile(
    path.join(process.cwd(), 'src/content/distribucion.json'),
    'utf8'
  )
  return JSON.parse(raw) as Distribucion
}
