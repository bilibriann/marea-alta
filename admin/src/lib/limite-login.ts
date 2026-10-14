// Freno contra fuerza bruta en /login. El contador vive en memoria: en Vercel
// cada instancia tiene el suyo y se pierde cuando la instancia se recicla, así
// que es un freno "best effort", no un límite global. Para uno estricto haría
// falta un store compartido (Upstash/KV) o una regla del firewall de Vercel.
//
// Se lleva una cuenta por IP y otra por nombre de usuario (mismos límites):
// la de IP frena a quien prueba muchas contraseñas contra una cuenta, y la de
// usuario frena a quien reparte los intentos entre muchas IPs distintas
// (botnet, proxies rotativos) contra una sola cuenta. Cualquiera de las dos
// que llegue al tope bloquea el intento.

const MAX_INTENTOS = 5
const VENTANA_MS = 15 * 60 * 1000
/** Pausa en cada fallo: vuelve lento probar contraseñas aunque no se llegue al tope. */
export const PAUSA_FALLO_MS = 1000

const fallos = new Map<string, { cantidad: number; desde: number }>()

function clavesDe(ip: string, usuario: string): string[] {
  return [`ip:${ip}`, `usuario:${usuario.toLowerCase()}`]
}

export function estaBloqueado(ip: string, usuario: string): boolean {
  return clavesDe(ip, usuario).some((clave) => {
    const registro = fallos.get(clave)
    if (!registro) return false
    if (Date.now() - registro.desde > VENTANA_MS) {
      fallos.delete(clave)
      return false
    }
    return registro.cantidad >= MAX_INTENTOS
  })
}

export function registrarFallo(ip: string, usuario: string): void {
  for (const clave of clavesDe(ip, usuario)) {
    const registro = fallos.get(clave)
    if (!registro || Date.now() - registro.desde > VENTANA_MS) {
      fallos.set(clave, { cantidad: 1, desde: Date.now() })
    } else {
      registro.cantidad++
    }
  }
}

export function limpiarFallos(ip: string, usuario: string): void {
  for (const clave of clavesDe(ip, usuario)) fallos.delete(clave)
}

/**
 * IP del cliente, con esta prioridad:
 * 1. `cf-connecting-ip`, pero solo si TRUST_CLOUDFLARE=true: esa cabecera la
 *    sobreescribe Cloudflare y el cliente no puede falsificarla, pero eso
 *    vale solo cuando el tráfico realmente pasa por Cloudflare. Hoy no es el
 *    caso — sin Cloudflare delante, cualquiera puede mandar esa cabecera
 *    directo al origin y falsificar su IP para esquivar el límite, así que
 *    queda ignorada hasta que se active la variable.
 * 2. Primer valor de `x-forwarded-for`: hoy la arma la plataforma (Vercel)
 *    antes de llegar a la función.
 * 3. Valor fijo `'desconocida'`: si falta también `x-forwarded-for`, todas
 *    las requests sin esa cabecera comparten una sola clave de límite — peor
 *    que nada sería no limitar en absoluto, así que se agrupan ahí en vez de
 *    quedar sin control.
 */
export function obtenerIp(headers: Headers): string {
  if (process.env.TRUST_CLOUDFLARE === 'true') {
    const cf = headers.get('cf-connecting-ip')
    if (cf) return cf
  }
  const xff = headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  if (xff) return xff
  return 'desconocida'
}

/**
 * Solo rutas internas del panel. Rechaza URLs absolutas ("https://otro.com")
 * y las que el navegador interpreta como otro dominio ("//otro.com", "/\otro.com").
 */
export function destinoSeguro(from: string): string {
  if (from.startsWith('/') && !from.startsWith('//') && !from.startsWith('/\\')) return from
  return '/admin/'
}
