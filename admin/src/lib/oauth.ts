// Reimplementación fiel del protocolo de https://github.com/sveltia/sveltia-cms-auth
// (contrato que el frontend de Sveltia CMS espera de su proxy OAuth), adaptada a
// Route Handlers de Next.js y limitada a GitHub (no usamos GitLab).

interface OutputHtmlArgs {
  provider?: string
  token?: string
  error?: string
  errorCode?: string
}

// Handshake por postMessage con la ventana que abrió el popup (Sveltia CMS):
// 1. Esta página avisa "authorizing:{provider}" al opener.
// 2. Sveltia CMS responde con el mismo mensaje, revelando su origin real.
// 3. Recién ahí respondemos con el token, dirigido a ese origin (nunca '*').
export function outputHtml({ provider = 'unknown', token, error, errorCode }: OutputHtmlArgs): Response {
  const state = error ? 'error' : 'success'
  const content = error ? { provider, error, errorCode } : { provider, token }

  const html = `<!doctype html><html><body><script>
(() => {
  window.addEventListener('message', ({ data, origin }) => {
    if (data === 'authorizing:${provider}') {
      window.opener?.postMessage(
        'authorization:${provider}:${state}:${JSON.stringify(content)}',
        origin
      )
    }
  })
  window.opener?.postMessage('authorizing:${provider}', '*')
})()
</script></body></html>`

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html;charset=UTF-8',
      'Set-Cookie': 'csrf-token=deleted; HttpOnly; Max-Age=0; Path=/; SameSite=Lax; Secure',
    },
  })
}

export function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
