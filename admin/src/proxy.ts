import { NextResponse, type NextRequest } from 'next/server'
import {
  SESSION_COOKIE,
  SESSION_COOKIE_OPTIONS,
  SESSION_RENEWAL_THRESHOLD_SECONDS,
  signSession,
  verifySession,
} from '@/lib/auth'

export async function proxy(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value
  const session = token ? await verifySession(token) : null

  if (!session) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  const response = NextResponse.next()

  const emitidaHace = Math.floor(Date.now() / 1000) - (session.iat ?? 0)
  if (emitidaHace > SESSION_RENEWAL_THRESHOLD_SECONDS) {
    const nuevoToken = await signSession({
      userId: session.userId,
      nombreUsuario: session.nombreUsuario,
      rol: session.rol,
    })
    response.cookies.set(SESSION_COOKIE, nuevoToken, SESSION_COOKIE_OPTIONS)
  }

  return response
}

export const config = {
  matcher: ['/((?!login|_next/static|_next/image|favicon.ico).*)'],
}
