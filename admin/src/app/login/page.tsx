import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { verificarCredenciales } from '@/lib/credenciales'
import { signSession, SESSION_COOKIE, SESSION_COOKIE_OPTIONS } from '@/lib/auth'
import {
  destinoSeguro,
  estaBloqueado,
  limpiarFallos,
  obtenerIp,
  PAUSA_FALLO_MS,
  registrarFallo,
} from '@/lib/limite-login'

async function login(formData: FormData) {
  'use server'

  const nombreUsuario = String(formData.get('nombreUsuario') ?? '')
  const password = String(formData.get('password') ?? '')
  const from = destinoSeguro(String(formData.get('from') || '/admin/'))
  const ip = obtenerIp(await headers())

  if (estaBloqueado(ip, nombreUsuario)) {
    redirect(`/login?error=bloqueado&from=${encodeURIComponent(from)}`)
  }

  const credenciales = await verificarCredenciales(nombreUsuario, password)
  if (!credenciales) {
    registrarFallo(ip, nombreUsuario)
    await new Promise((resolve) => setTimeout(resolve, PAUSA_FALLO_MS))
    redirect(`/login?error=1&from=${encodeURIComponent(from)}`)
  }

  limpiarFallos(ip, nombreUsuario)
  const token = await signSession(credenciales)
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, token, SESSION_COOKIE_OPTIONS)

  redirect(from)
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; error?: string }>
}) {
  const { from, error } = await searchParams
  const redirectTo = destinoSeguro(from || '/admin/')

  return (
    <main className="login-page">
      <div className="login-card">
        <h1 className="login-title">Panel de Administración</h1>
        <p className="login-subtitle">Marea Alta — acceso restringido</p>
        <form action={login}>
          <input type="hidden" name="from" value={redirectTo} />
          <label htmlFor="nombreUsuario" className="login-label">
            Usuario
          </label>
          <input
            id="nombreUsuario"
            name="nombreUsuario"
            type="text"
            required
            autoFocus
            autoComplete="username"
            className="login-input"
          />
          <label htmlFor="password" className="login-label">
            Contraseña
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="login-input"
          />
          {error && (
            <p className="login-error">
              {error === 'bloqueado'
                ? 'Demasiados intentos. Espera 15 minutos.'
                : 'Usuario o contraseña incorrectos.'}
            </p>
          )}
          <button type="submit" className="login-button">
            Ingresar
          </button>
        </form>
      </div>
    </main>
  )
}
