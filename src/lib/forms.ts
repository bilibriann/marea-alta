import { CONTACT_EMAIL } from '@/config'

export interface FormResult {
  ok: boolean
  error?: string
}

/**
 * Largo máximo por campo. Los formularios lo usan como `maxLength` y postForm
 * recorta igual, por si alguien quita el atributo desde las devtools.
 */
export const LIMITES = {
  nombre: 100,
  email: 254,
  mensaje: 3000,
} as const

/**
 * Nombre del campo trampa (honeypot). Lo renderiza <CampoTrampa />: invisible
 * para personas, pero los bots que rellenan todo lo que encuentran lo llenan.
 */
export const CAMPO_TRAMPA = 'sitio_web'

/** Segundos que hay que esperar entre un envío exitoso y el siguiente. */
const ESPERA_ENTRE_ENVIOS = 30
let ultimoEnvio = 0

interface EnvioBase {
  /** Valor del campo trampa. Si viene con algo, quien envía es un bot. */
  trampa?: string
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
  asunto: string,
  trampa?: string
): Promise<FormResult> {
  // Al bot se le responde "ok" sin enviar nada: no gasta cuota de Web3Forms
  // y tampoco recibe una señal de que lo detectamos.
  if (trampa) return { ok: true }

  const espera = ESPERA_ENTRE_ENVIOS - Math.floor((Date.now() - ultimoEnvio) / 1000)
  if (espera > 0) {
    return { ok: false, error: `Ya recibimos tu mensaje. Espera ${espera} s para enviar otro.` }
  }

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
    ultimoEnvio = Date.now()
    return { ok: true }
  } catch {
    return {
      ok: false,
      error: 'No se pudo enviar el mensaje. Revisa tu conexión e intenta nuevamente.',
    }
  }
}

function recortar(valor: string, limite: number): string {
  return valor.trim().slice(0, limite)
}

export interface ContactFormData extends EnvioBase {
  nombre: string
  email: string
  mensaje: string
}

export async function sendContactForm(data: ContactFormData): Promise<FormResult> {
  const nombre = recortar(data.nombre, LIMITES.nombre)
  const email = recortar(data.email, LIMITES.email)
  return postForm(
    { nombre, email, replyto: email, mensaje: recortar(data.mensaje, LIMITES.mensaje) },
    `Contacto web — ${nombre}`,
    data.trampa
  )
}

export async function subscribeNewsletter(email: string): Promise<FormResult> {
  const recortado = recortar(email, LIMITES.email)
  return postForm({ email: recortado, replyto: recortado }, 'Nueva suscripción al newsletter')
}

export interface CotizacionFormData extends EnvioBase {
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
  const email = recortar(data.email, LIMITES.email)
  return postForm(
    {
      nombre: recortar(data.nombre, LIMITES.nombre),
      apellido: recortar(data.apellido, LIMITES.nombre),
      email,
      replyto: email,
      mensaje: recortar(data.mensaje, LIMITES.mensaje),
      producto: data.producto,
      ...(data.productoUrl ? { producto_url: data.productoUrl } : {}),
      cantidades: data.cantidades,
    },
    `Cotización — ${data.producto}`,
    data.trampa
  )
}
