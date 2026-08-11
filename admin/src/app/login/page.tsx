import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { checkPassword } from '@/lib/password'
import { signSession, SESSION_COOKIE, SESSION_COOKIE_OPTIONS } from '@/lib/auth'

async function login(formData: FormData) {
  'use server'

  const password = String(formData.get('password') ?? '')
  const from = String(formData.get('from') || '/admin/')

  const role = checkPassword(password)
  if (!role) {
    redirect(`/login?error=1&from=${encodeURIComponent(from)}`)
  }

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
  const redirectTo = from || '/admin/'

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
          {error && <p className="login-error">Contraseña incorrecta.</p>}
          <button type="submit" className="login-button">
            Ingresar
          </button>
        </form>
      </div>
    </main>
  )
}
