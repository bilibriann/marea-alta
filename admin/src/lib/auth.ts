import { SignJWT, jwtVerify, type JWTPayload } from 'jose'
import type { Rol } from '@prisma/client'

export const SESSION_COOKIE = 'admin_session'
export const SESSION_DURATION = '30d'
// Umbral de renovación de la sesión "sliding": si el usuario sigue activo
// pasado este tiempo desde que se firmó el token, se reemite uno nuevo con
// los 30 días completos otra vez (ver proxy.ts). Evita re-firmar en cada
// request sin dejar de extender la sesión mientras haya uso real.
export const SESSION_RENEWAL_THRESHOLD_SECONDS = 60 * 60 * 24 // 1 día

export interface SessionPayload extends JWTPayload {
  userId: number
  nombreUsuario: string
  rol: Rol
}

function getSecretKey(): Uint8Array {
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret) {
    throw new Error('ADMIN_SESSION_SECRET no está configurado.')
  }
  return new TextEncoder().encode(secret)
}

export async function signSession(payload: {
  userId: number
  nombreUsuario: string
  rol: Rol
}): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(SESSION_DURATION)
    .sign(getSecretKey())
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify<SessionPayload>(token, getSecretKey())
    if (payload.rol !== 'admin' && payload.rol !== 'dev') return null
    if (typeof payload.userId !== 'number' || typeof payload.nombreUsuario !== 'string') return null
    return payload
  } catch {
    return null
  }
}

export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
}
