import Link from 'next/link'
import { listarProductos } from '@/lib/productos'
import BotonEliminarProducto from './BotonEliminarProducto'

export default async function ProductosPage() {
  const productos = await listarProductos()

  return (
    <div>
      <div className="panel-toolbar">
        <h1>Productos</h1>
        <Link href="/productos/nuevo" className="btn-primario">
          Nuevo producto
        </Link>
      </div>

      <table className="tabla">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Estado</th>
            <th>Imágenes</th>
            <th>Creado por</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {productos.map((p) => (
            <tr key={p.id}>
              <td>{p.nombre}</td>
              <td>
                <span className={`badge badge-${p.estado}`}>{p.estado}</span>
              </td>
              <td>{p.imagenes.length}</td>
              <td>{p.creadoPor?.nombreUsuario ?? '—'}</td>
              <td>
                <div className="tabla-acciones">
                  <Link href={`/productos/${p.id}`}>Editar</Link>
                  <BotonEliminarProducto id={p.id} nombre={p.nombre} />
                </div>
              </td>
            </tr>
          ))}
          {productos.length === 0 && (
            <tr>
              <td colSpan={5}>No hay productos todavía.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
