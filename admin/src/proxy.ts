import { NextResponse, type NextRequest } from 'next/server'
import { SESSION_COOKIE, verifySession } from '@/lib/auth'

export async function proxy(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value
  const session = token ? await verifySession(token) : null

  if (session) return NextResponse.next()

  const loginUrl = new URL('/login', request.url)
  loginUrl.searchParams.set('from', request.nextUrl.pathname)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  // auth/callback quedan fuera: son el intercambio OAuth de Sveltia con
  // GitHub (protegido por su propio CSRF token + cookie), no contenido del
  // panel — y GitHub redirige el navegador ahí directamente, sin nuestra
  // cookie de sesión necesariamente "fresca" en ese viaje.
  matcher: ['/((?!login|auth|callback|_next/static|_next/image|favicon.ico).*)'],
}
