import { z } from 'zod'
import { prisma } from './db'
import { slugUnico } from './slug'
import { eliminarImagen, keyDesdeUrl } from './storage'
import type { Estado } from '@prisma/client'

const grupoOpcionesSchema = z.object({
  tituloGrupo: z.string().min(1),
  opciones: z.array(z.string().min(1)).min(1),
})

const imagenSchema = z.object({
  url: z.string().min(1),
})

export const productoInputSchema = z.object({
  nombre: z.string().min(1),
  subtitulo: z.string().min(1).optional(),
  notaAdicional: z.string().min(1).optional(),
  videoYoutubeUrl: z.url().optional(),
  estado: z.enum(['borrador', 'publicado']).default('borrador'),
  cantidadesParaCotizar: z.array(z.string().min(1)).default([]),
  gruposOpciones: z.array(grupoOpcionesSchema).default([]),
  imagenes: z.array(imagenSchema).default([]),
})

export type ProductoInput = z.infer<typeof productoInputSchema>

async function slugYaExiste(slug: string, ignorarId?: number): Promise<boolean> {
  const existente = await prisma.producto.findUnique({ where: { slug } })
  return !!existente && existente.id !== ignorarId
}

/**
 * Borra de R2/MinIO las imágenes que ya no están referenciadas. Best-effort:
 * si una key individual falla al borrar, no aborta el resto — un archivo
 * huérfano en storage es un costo menor, no un problema de correctitud
 * (la base de datos sigue siendo la fuente de verdad de qué se muestra).
 */
async function limpiarImagenesHuerfanas(urlsAnteriores: string[], urlsNuevas: string[]) {
  const nuevasSet = new Set(urlsNuevas)
  const huerfanas = urlsAnteriores.filter((url) => !nuevasSet.has(url))
  await Promise.allSettled(huerfanas.map((url) => eliminarImagen(keyDesdeUrl(url))))
}

const productoConRelaciones = {
  imagenes: { orderBy: { orden: 'asc' as const } },
  gruposOpciones: { orderBy: { orden: 'asc' as const } },
  creadoPor: { select: { id: true, nombreUsuario: true } },
}

export async function listarProductos() {
  return prisma.producto.findMany({
    include: productoConRelaciones,
    orderBy: { fechaActualizacion: 'desc' },
  })
}

export async function obtenerProducto(id: number) {
  return prisma.producto.findUnique({ where: { id }, include: productoConRelaciones })
}

export async function crearProducto(input: ProductoInput, creadoPorId: number) {
  const datos = productoInputSchema.parse(input)
  const slug = await slugUnico(datos.nombre, (s) => slugYaExiste(s))

  return prisma.producto.create({
    data: {
      nombre: datos.nombre,
      slug,
      subtitulo: datos.subtitulo,
      notaAdicional: datos.notaAdicional,
      videoYoutubeUrl: datos.videoYoutubeUrl,
      estado: datos.estado as Estado,
      cantidadesParaCotizar: datos.cantidadesParaCotizar,
      creadoPorId,
      imagenes: {
        create: datos.imagenes.map((img, orden) => ({ url: img.url, orden })),
      },
      gruposOpciones: {
        create: datos.gruposOpciones.map((grupo, orden) => ({
          tituloGrupo: grupo.tituloGrupo,
          opciones: grupo.opciones,
          orden,
        })),
      },
    },
    include: productoConRelaciones,
  })
}

/**
 * Actualiza un producto. Las imágenes y grupos de opciones se reemplazan
 * por completo (borrar + recrear) en vez de diffear — es una operación de
 * bajo volumen (unas pocas decenas de productos) donde la simplicidad vale
 * más que optimizar un diff incremental.
 */
export async function actualizarProducto(id: number, input: ProductoInput) {
  const datos = productoInputSchema.parse(input)
  const actual = await prisma.producto.findUnique({ where: { id }, include: { imagenes: true } })
  if (!actual) return null

  const slug =
    actual.nombre === datos.nombre ? actual.slug : await slugUnico(datos.nombre, (s) => slugYaExiste(s, id))

  const resultado = await prisma.$transaction(async (tx) => {
    await tx.imagenProducto.deleteMany({ where: { productoId: id } })
    await tx.grupoOpciones.deleteMany({ where: { productoId: id } })

    return tx.producto.update({
      where: { id },
      data: {
        nombre: datos.nombre,
        slug,
        subtitulo: datos.subtitulo,
        notaAdicional: datos.notaAdicional,
        videoYoutubeUrl: datos.videoYoutubeUrl,
        estado: datos.estado as Estado,
        cantidadesParaCotizar: datos.cantidadesParaCotizar,
        imagenes: {
          create: datos.imagenes.map((img, orden) => ({ url: img.url, orden })),
        },
        gruposOpciones: {
          create: datos.gruposOpciones.map((grupo, orden) => ({
            tituloGrupo: grupo.tituloGrupo,
            opciones: grupo.opciones,
            orden,
          })),
        },
      },
      include: productoConRelaciones,
    })
  })

  await limpiarImagenesHuerfanas(
    actual.imagenes.map((img) => img.url),
    datos.imagenes.map((img) => img.url)
  )

  return resultado
}

export async function eliminarProducto(id: number) {
  const actual = await prisma.producto.findUnique({ where: { id }, include: { imagenes: true } })
  if (!actual) return

  await prisma.producto.delete({ where: { id } })
  await limpiarImagenesHuerfanas(
    actual.imagenes.map((img) => img.url),
    []
  )
}
