import Link from 'next/link'
import { obtenerSesionActual } from '@/lib/sesion'
import { cerrarSesionAction } from '@/lib/actions/sesion'

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const sesion = await obtenerSesionActual()

  return (
    <div className="panel">
      <header className="panel-header">
        <nav className="panel-nav">
          <Link href="/" className="panel-brand">
            Marea Alta
          </Link>
          <Link href="/productos">Productos</Link>
          <Link href="/noticias">Noticias</Link>
        </nav>
        <div className="panel-user">
          {sesion && (
            <span className="panel-user-info">
              {sesion.nombreUsuario} · {sesion.rol}
            </span>
          )}
          <form action={cerrarSesionAction}>
            <button type="submit" className="btn-link">
              Cerrar sesión
            </button>
          </form>
        </div>
      </header>
      <main className="panel-content">{children}</main>
    </div>
  )
}
