import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { checkPassword } from '@/lib/password'
import { signSession, SESSION_COOKIE, SESSION_COOKIE_OPTIONS } from '@/lib/auth'
import {
  destinoSeguro,
  estaBloqueado,
  limpiarFallos,
  PAUSA_FALLO_MS,
  registrarFallo,
} from '@/lib/limite-login'

async function login(formData: FormData) {
  'use server'

  const password = String(formData.get('password') ?? '')
  const from = destinoSeguro(String(formData.get('from') || '/admin/'))
  // En Vercel x-forwarded-for lo arma la plataforma; el primer valor es el cliente.
  const ip = (await headers()).get('x-forwarded-for')?.split(',')[0].trim() || 'desconocida'

  if (estaBloqueado(ip)) {
    redirect(`/login?error=bloqueado&from=${encodeURIComponent(from)}`)
  }

  const role = checkPassword(password)
  if (!role) {
    registrarFallo(ip)
    await new Promise((resolve) => setTimeout(resolve, PAUSA_FALLO_MS))
    redirect(`/login?error=1&from=${encodeURIComponent(from)}`)
  }

  limpiarFallos(ip)
  const token = await signSession(role)
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
    <main>
      <div className="login-card">
        <h1 className="login-title">Panel de Administración</h1>
        <p className="login-subtitle">Marea Alta — acceso restringido</p>
        <form action={login}>
          <input type="hidden" name="from" value={redirectTo} />
          <label htmlFor="password" className="login-label">
            Contraseña
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoFocus
            className="login-input"
          />
          {error && (
            <p className="login-error">
              {error === 'bloqueado'
                ? 'Demasiados intentos. Espera 15 minutos.'
                : 'Contraseña incorrecta.'}
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
