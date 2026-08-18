import { cookies } from 'next/headers'
import { SESSION_COOKIE, verifySession, type SessionPayload } from './auth'

export async function obtenerSesionActual(): Promise<SessionPayload | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value
  return token ? verifySession(token) : null
}
