'use server'

import { revalidatePath } from 'next/cache'
import { obtenerSesionActual } from '../sesion'
import * as noticiasDb from '../noticias'
import type { NoticiaInput } from '../noticias'

export async function crearNoticiaAction(input: NoticiaInput): Promise<{ id: number }> {
  const sesion = await obtenerSesionActual()
  if (!sesion) throw new Error('No autenticado')

  const noticia = await noticiasDb.crearNoticia(input, sesion.userId)
  revalidatePath('/noticias')
  return { id: noticia.id }
}

export async function actualizarNoticiaAction(id: number, input: NoticiaInput): Promise<{ id: number }> {
  const sesion = await obtenerSesionActual()
  if (!sesion) throw new Error('No autenticado')

  const noticia = await noticiasDb.actualizarNoticia(id, input)
  if (!noticia) throw new Error('Noticia no encontrada')
  revalidatePath('/noticias')
  revalidatePath(`/noticias/${id}`)
  return { id: noticia.id }
}

export async function eliminarNoticiaAction(id: number): Promise<void> {
  const sesion = await obtenerSesionActual()
  if (!sesion) throw new Error('No autenticado')

  await noticiasDb.eliminarNoticia(id)
  revalidatePath('/noticias')
}
