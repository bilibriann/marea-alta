import Link from 'next/link'
import { listarNoticias } from '@/lib/noticias'
import BotonEliminarNoticia from './BotonEliminarNoticia'

export default async function NoticiasPage() {
  const noticias = await listarNoticias()

  return (
    <div>
      <div className="panel-toolbar">
        <h1>Noticias</h1>
        <Link href="/noticias/nuevo" className="btn-primario">
          Nueva noticia
        </Link>
      </div>

      <table className="tabla">
        <thead>
          <tr>
            <th>Título</th>
            <th>Fecha</th>
            <th>Estado</th>
            <th>Creado por</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {noticias.map((n) => (
            <tr key={n.id}>
              <td>{n.titulo}</td>
              <td>{n.fecha.toLocaleDateString('es-CL', { timeZone: 'UTC' })}</td>
              <td>
                <span className={`badge badge-${n.estado}`}>{n.estado}</span>
              </td>
              <td>{n.creadoPor?.nombreUsuario ?? '—'}</td>
              <td>
                <div className="tabla-acciones">
                  <Link href={`/noticias/${n.id}`}>Editar</Link>
                  <BotonEliminarNoticia id={n.id} titulo={n.titulo} />
                </div>
              </td>
            </tr>
          ))}
          {noticias.length === 0 && (
            <tr>
              <td colSpan={5}>No hay noticias todavía.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
