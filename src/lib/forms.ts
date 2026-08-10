export interface ContactFormData {
  nombre: string
  email: string
  mensaje: string
}

export interface FormResult {
  ok: boolean
  error?: string
}

export async function sendContactForm(_data: ContactFormData): Promise<FormResult> {
  // stub — conectar Formspree o Web3Forms aquí
  return { ok: true }
}

export async function subscribeNewsletter(_email: string): Promise<FormResult> {
  // stub — conectar servicio de email marketing aquí
  return { ok: true }
}

export interface CotizacionFormData {
  nombre: string
  apellido: string
  email: string
  mensaje: string
  producto: string
  cantidades: string[]
}

export async function sendCotizacionForm(data: CotizacionFormData): Promise<FormResult> {
  const endpoint = process.env.NEXT_PUBLIC_FORMS_ENDPOINT
  if (!endpoint) {
    return { ok: false, error: 'El formulario de cotización aún no está configurado.' }
  }

  const body = new FormData()
  body.append('nombre', data.nombre)
  body.append('apellido', data.apellido)
  body.append('email', data.email)
  body.append('mensaje', data.mensaje)
  body.append('producto', data.producto)
  for (const cantidad of data.cantidades) {
    body.append('cantidades', cantidad)
  }

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      body,
      headers: { Accept: 'application/json' },
    })
    if (!res.ok) {
      return { ok: false, error: 'No se pudo enviar la cotización. Intenta nuevamente.' }
    }
    return { ok: true }
  } catch {
    return { ok: false, error: 'No se pudo enviar la cotización. Revisa tu conexión e intenta nuevamente.' }
  }
}
