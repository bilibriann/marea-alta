import type { Metadata } from 'next'
import { getProductosContent, getAllProductos } from '@/lib/productos'
import { Reveal } from '@/components/Reveal'
import { TarjetaProducto } from '@/components/TarjetaProducto'

export const metadata: Metadata = {
  title: 'Productos',
  description: 'Soluciones de embalaje térmico de alta precisión fabricadas por Marea Alta Chile.',
}

export default async function ProductosPage() {
  const [contenido, productos] = await Promise.all([getProductosContent(), getAllProductos()])

  return (
    <div className="mx-auto max-w-7xl px-4 py-20 md:px-12">
      <Reveal className="mb-16 max-w-2xl">
        <span className="mb-2 block font-mono text-label-sm font-bold uppercase tracking-widest text-tertiary">
          Catálogo
        </span>
        <h1 className="linea-decorativa text-headline-lg-mobile text-primary md:text-headline-xl">
          {contenido.titulo}
        </h1>
        <p className="mt-4 text-on-surface-variant">{contenido.descripcion}</p>
      </Reveal>

      {productos.length === 0 ? (
        <p className="text-on-surface-variant">Aún no hay productos publicados.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {productos.map((producto, indice) => (
            <TarjetaProducto
              key={producto.slug}
              producto={producto}
              retraso={indice * 120}
              nivelTitulo="h2"
            />
          ))}
        </div>
      )}
    </div>
  )
}
