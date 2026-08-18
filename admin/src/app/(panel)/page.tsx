import Link from 'next/link'
import { obtenerSesionActual } from '@/lib/sesion'

export default async function DashboardPage() {
  const sesion = await obtenerSesionActual()

  return (
    <div>
      <h1>Panel de Administración</h1>
      {sesion && (
        <p>
          Sesión activa: {sesion.nombreUsuario} ({sesion.rol})
        </p>
      )}
      <div className="dashboard-links">
        <Link href="/productos" className="btn-primario">
          Gestionar Productos
        </Link>
        <Link href="/noticias" className="btn-primario">
          Gestionar Noticias
        </Link>
      </div>
    </div>
  )
}
