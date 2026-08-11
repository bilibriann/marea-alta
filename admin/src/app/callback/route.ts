import type { NextRequest } from 'next/server'
import { outputHtml } from '@/lib/oauth'

// Paso 2 del flujo OAuth: GitHub redirige acá con un `code`. Lo canjeamos por
// un access token (requiere el client secret, por eso esto corre en servidor
// y no en el navegador) y se lo devolvemos a Sveltia vía postMessage.
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')

  const cookieValue = request.cookies.get('csrf-token')?.value ?? ''
  const match = cookieValue.match(/^([a-z]+)_([0-9a-f]{32})$/)
  const [, provider, csrfToken] = match ?? []

  if (provider !== 'github') {
    return outputHtml({
      error: 'Your Git backend is not supported by the authenticator.',
      errorCode: 'UNSUPPORTED_BACKEND',
    })
  }

  if (!code || !state) {
    return outputHtml({
      provider,
      error: 'Failed to receive an authorization code. Please try again later.',
      errorCode: 'AUTH_CODE_REQUEST_FAILED',
    })
  }

  if (!csrfToken || state !== csrfToken) {
    return outputHtml({
      provider,
      error: 'Potential CSRF attack detected. Authentication flow aborted.',
      errorCode: 'CSRF_DETECTED',
    })
  }

  const clientId = process.env.GITHUB_CLIENT_ID
  const clientSecret = process.env.GITHUB_CLIENT_SECRET
  const hostname = process.env.GITHUB_HOSTNAME || 'github.com'

  if (!clientId || !clientSecret) {
    return outputHtml({
      provider,
      error: 'OAuth app client ID or secret is not configured.',
      errorCode: 'MISCONFIGURED_CLIENT',
    })
  }

  let tokenResponse: Response | undefined
  try {
    tokenResponse = await fetch(`https://${hostname}/login/oauth/access_token`, {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, client_id: clientId, client_secret: clientSecret }),
    })
  } catch {
    // tokenResponse queda undefined
  }

  if (!tokenResponse) {
    return outputHtml({
      provider,
      error: 'Failed to request an access token. Please try again later.',
      errorCode: 'TOKEN_REQUEST_FAILED',
    })
  }

  let token = ''
  let error = ''
  try {
    const data = await tokenResponse.json()
    token = data.access_token ?? ''
    error = data.error ?? ''
  } catch {
    return outputHtml({
      provider,
      error: 'Server responded with malformed data. Please try again later.',
      errorCode: 'MALFORMED_RESPONSE',
    })
  }

  return outputHtml({ provider, token, error })
}
