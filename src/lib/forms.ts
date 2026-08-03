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
