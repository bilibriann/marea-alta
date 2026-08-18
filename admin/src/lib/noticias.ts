import { z } from 'zod'
import { prisma } from './db'
import { slugUnico } from './slug'
import { eliminarImagen, keyDesdeUrl } from './storage'
import type { Estado } from '@prisma/client'

export const noticiaInputSchema = z.object({
  titulo: z.string().min(1),
  imagenDestacadaUrl: z.string().min(1),
  fecha: z.coerce.date(),
  extracto: z.string().min(1),
  contenido: z.string().min(1),
  estado: z.enum(['borrador', 'publicado']).default('borrador'),
})

export type NoticiaInput = z.infer<typeof noticiaInputSchema>

async function slugYaExiste(slug: string, ignorarId?: number): Promise<boolean> {
  const existente = await prisma.noticia.findUnique({ where: { slug } })
  return !!existente && existente.id !== ignorarId
}

const noticiaConRelaciones = {
  creadoPor: { select: { id: true, nombreUsuario: true } },
}

export async function listarNoticias() {
  return prisma.noticia.findMany({
    include: noticiaConRelaciones,
    orderBy: { fecha: 'desc' },
  })
}

export async function obtenerNoticia(id: number) {
  return prisma.noticia.findUnique({ where: { id }, include: noticiaConRelaciones })
}

export async function crearNoticia(input: NoticiaInput, creadoPorId: number) {
  const datos = noticiaInputSchema.parse(input)
  const slug = await slugUnico(datos.titulo, (s) => slugYaExiste(s))

  return prisma.noticia.create({
    data: { ...datos, estado: datos.estado as Estado, slug, creadoPorId },
    include: noticiaConRelaciones,
  })
}

export async function actualizarNoticia(id: number, input: NoticiaInput) {
  const datos = noticiaInputSchema.parse(input)
  const actual = await prisma.noticia.findUnique({ where: { id } })
  if (!actual) return null

  const slug =
    actual.titulo === datos.titulo ? actual.slug : await slugUnico(datos.titulo, (s) => slugYaExiste(s, id))

  const resultado = await prisma.noticia.update({
    where: { id },
    data: { ...datos, estado: datos.estado as Estado, slug },
    include: noticiaConRelaciones,
  })

  if (actual.imagenDestacadaUrl !== datos.imagenDestacadaUrl) {
    await eliminarImagen(keyDesdeUrl(actual.imagenDestacadaUrl)).catch(() => {})
  }

  return resultado
}

export async function eliminarNoticia(id: number) {
  const actual = await prisma.noticia.findUnique({ where: { id } })
  if (!actual) return

  await prisma.noticia.delete({ where: { id } })
  await eliminarImagen(keyDesdeUrl(actual.imagenDestacadaUrl)).catch(() => {})
}
