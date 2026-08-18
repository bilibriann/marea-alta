'use server'

import { revalidatePath } from 'next/cache'
import { obtenerSesionActual } from '../sesion'
import * as productosDb from '../productos'
import type { ProductoInput } from '../productos'

export async function crearProductoAction(input: ProductoInput): Promise<{ id: number }> {
  const sesion = await obtenerSesionActual()
  if (!sesion) throw new Error('No autenticado')

  const producto = await productosDb.crearProducto(input, sesion.userId)
  revalidatePath('/productos')
  return { id: producto.id }
}

export async function actualizarProductoAction(id: number, input: ProductoInput): Promise<{ id: number }> {
  const sesion = await obtenerSesionActual()
  if (!sesion) throw new Error('No autenticado')

  const producto = await productosDb.actualizarProducto(id, input)
  if (!producto) throw new Error('Producto no encontrado')
  revalidatePath('/productos')
  revalidatePath(`/productos/${id}`)
  return { id: producto.id }
}

export async function eliminarProductoAction(id: number): Promise<void> {
  const sesion = await obtenerSesionActual()
  if (!sesion) throw new Error('No autenticado')

  await productosDb.eliminarProducto(id)
  revalidatePath('/productos')
}
