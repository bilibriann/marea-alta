import { CONTACT_EMAIL } from '@/config'

export interface FormResult {
  ok: boolean
  error?: string
}

/**
 * Único camino de envío del sitio. Contacto, newsletter y las cotizaciones por
 * producto pasan todos por aquí; no agregues un segundo `fetch` en otro lado.
 *
 * El destinatario sale siempre de CONTACT_EMAIL (src/config.ts). Ojo: en el
 * plan gratuito Web3Forms entrega al buzón asociado a la access key e ignora
 * `to`; se manda igual para que el destino viaje en el payload y para que al
 * confirmar el dominio baste con cambiar la constante.
 */
async function postForm(
  campos: Record<string, string | string[]>,
  asunto: string
): Promise<FormResult> {
  const endpoint = process.env.NEXT_PUBLIC_FORMS_ENDPOINT
  if (!endpoint) {
    return { ok: false, error: 'El formulario aún no está configurado.' }
  }

  const body = new FormData()
  const web3formsAccessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY
  if (web3formsAccessKey) {
    body.append('access_key', web3formsAccessKey)
  }
  body.append('to', CONTACT_EMAIL)
  body.append('subject', asunto)

  for (const [clave, valor] of Object.entries(campos)) {
    if (Array.isArray(valor)) {
      for (const item of valor) body.append(clave, item)
    } else if (valor) {
      body.append(clave, valor)
    }
  }

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      body,
      headers: { Accept: 'application/json' },
    })
    if (!res.ok) {
      return { ok: false, error: 'No se pudo enviar el mensaje. Intenta nuevamente.' }
    }
    return { ok: true }
  } catch {
    return { ok: false, error: 'No se pudo enviar el mensaje. Revisa tu conexión e intenta nuevamente.' }
  }
}

export interface ContactFormData {
  nombre: string
  email: string
  mensaje: string
}

export async function sendContactForm(data: ContactFormData): Promise<FormResult> {
  return postForm(
    { nombre: data.nombre, email: data.email, replyto: data.email, mensaje: data.mensaje },
    `Contacto web — ${data.nombre}`
  )
}

export async function subscribeNewsletter(email: string): Promise<FormResult> {
  return postForm({ email, replyto: email }, 'Nueva suscripción al newsletter')
}

export interface CotizacionFormData {
  nombre: string
  apellido: string
  email: string
  mensaje: string
  /** Nombre del producto desde cuya página se envía; va prellenado en el form. */
  producto: string
  /** URL de la ficha del producto, para que el correo enlace de vuelta. */
  productoUrl?: string
  cantidades: string[]
}

export async function sendCotizacionForm(data: CotizacionFormData): Promise<FormResult> {
  return postForm(
    {
      nombre: data.nombre,
      apellido: data.apellido,
      email: data.email,
      replyto: data.email,
      mensaje: data.mensaje,
      producto: data.producto,
      ...(data.productoUrl ? { producto_url: data.productoUrl } : {}),
      cantidades: data.cantidades,
    },
    `Cotización — ${data.producto}`
  )
}
