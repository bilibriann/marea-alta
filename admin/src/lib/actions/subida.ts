'use server'

import { obtenerSesionActual } from '../sesion'
import { subirImagen } from '../storage'

export async function subirImagenAction(formData: FormData): Promise<{ url: string }> {
  const sesion = await obtenerSesionActual()
  if (!sesion) throw new Error('No autenticado')

  const archivo = formData.get('archivo')
  const carpeta = formData.get('carpeta')
  if (!(archivo instanceof File)) throw new Error('Archivo inválido')
  if (carpeta !== 'productos' && carpeta !== 'noticias') throw new Error('Carpeta inválida')
  if (!archivo.type.startsWith('image/')) throw new Error('El archivo debe ser una imagen')

  const buffer = Buffer.from(await archivo.arrayBuffer())
  return subirImagen(buffer, {
    carpeta,
    nombreArchivo: archivo.name,
    contentType: archivo.type,
  })
}
