// Freno contra fuerza bruta en /login. El contador vive en memoria: en Vercel
// cada instancia tiene el suyo y se pierde cuando la instancia se recicla, así
// que es un freno "best effort", no un límite global. Para uno estricto haría
// falta un store compartido (Upstash/KV) o una regla del firewall de Vercel.

const MAX_INTENTOS = 5
const VENTANA_MS = 15 * 60 * 1000
/** Pausa en cada fallo: vuelve lento probar contraseñas aunque no se llegue al tope. */
export const PAUSA_FALLO_MS = 1000

const fallos = new Map<string, { cantidad: number; desde: number }>()

export function estaBloqueado(ip: string): boolean {
  const registro = fallos.get(ip)
  if (!registro) return false
  if (Date.now() - registro.desde > VENTANA_MS) {
    fallos.delete(ip)
    return false
  }
  return registro.cantidad >= MAX_INTENTOS
}

export function registrarFallo(ip: string): void {
  const registro = fallos.get(ip)
  if (!registro || Date.now() - registro.desde > VENTANA_MS) {
    fallos.set(ip, { cantidad: 1, desde: Date.now() })
  } else {
    registro.cantidad++
  }
}

export function limpiarFallos(ip: string): void {
  fallos.delete(ip)
}

/**
 * Solo rutas internas del panel. Rechaza URLs absolutas ("https://otro.com")
 * y las que el navegador interpreta como otro dominio ("//otro.com", "/\otro.com").
 */
export function destinoSeguro(from: string): string {
  if (from.startsWith('/') && !from.startsWith('//') && !from.startsWith('/\\')) return from
  return '/admin/'
}
