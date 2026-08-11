import { NextResponse, type NextRequest } from 'next/server'
import { escapeRegExp, outputHtml } from '@/lib/oauth'

// Paso 1 del flujo OAuth: Sveltia abre esto en un popup, lo redirigimos a la
// pantalla de autorización de GitHub con un token CSRF propio.
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const provider = searchParams.get('provider')
  const domain = searchParams.get('site_id') ?? ''

  if (provider !== 'github') {
    return outputHtml({
      error: 'Your Git backend is not supported by the authenticator.',
      errorCode: 'UNSUPPORTED_BACKEND',
    })
  }

  const allowedDomains = process.env.ALLOWED_DOMAINS
  if (
    allowedDomains &&
    !allowedDomains
      .split(',')
      .some((entry) => domain.match(new RegExp(`^${escapeRegExp(entry.trim()).replace('\\*', '.+')}$`)))
  ) {
    return outputHtml({
      provider,
      error: 'Your domain is not allowed to use the authenticator.',
      errorCode: 'UNSUPPORTED_DOMAIN',
    })
  }

  const clientId = process.env.GITHUB_CLIENT_ID
  if (!clientId) {
    return outputHtml({
      provider,
      error: 'OAuth app client ID or secret is not configured.',
      errorCode: 'MISCONFIGURED_CLIENT',
    })
  }

  const hostname = process.env.GITHUB_HOSTNAME || 'github.com'
  const csrfToken = crypto.randomUUID().replaceAll('-', '')
  const params = new URLSearchParams({ client_id: clientId, scope: 'repo,user', state: csrfToken })

  const response = NextResponse.redirect(`https://${hostname}/login/oauth/authorize?${params}`, 302)
  response.cookies.set('csrf-token', `${provider}_${csrfToken}`, {
    httpOnly: true,
    path: '/',
    maxAge: 600,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  })
  return response
}
