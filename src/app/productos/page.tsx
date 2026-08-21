import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getProductosContent, getAllProductos } from '@/lib/productos'

export const metadata: Metadata = {
  title: 'Productos',
  description: 'Soluciones de embalaje térmico de alta precisión fabricadas por Marea Alta Chile.',
}

export default async function ProductosPage() {
  const [contenido, productos] = await Promise.all([getProductosContent(), getAllProductos()])

  return (
    <div className="mx-auto max-w-7xl px-4 py-20 md:px-12">
      <div className="mb-16 max-w-2xl">
        <span className="mb-2 block font-mono text-label-sm font-bold uppercase tracking-widest text-tertiary">
          Catálogo
        </span>
        <h1 className="text-headline-lg-mobile text-primary md:text-headline-xl">
          {contenido.titulo}
        </h1>
        <p className="mt-4 text-on-surface-variant">{contenido.descripcion}</p>
      </div>

      {productos.length === 0 ? (
        <p className="text-on-surface-variant">Aún no hay productos publicados.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {productos.map((producto) => (
            <Link
              key={producto.slug}
              href={`/productos/${producto.slug}`}
              className="group flex flex-col overflow-hidden border border-outline-variant bg-surface-container-lowest transition-all duration-300 hover:border-primary"
            >
              <div className="relative h-64 w-full overflow-hidden">
                {producto.galeria[0] ? (
                  <Image
                    src={producto.galeria[0]}
                    alt={producto.nombre}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="h-full w-full bg-surface-container" />
                )}
              </div>
              <div className="border-t border-outline-variant/60 p-6">
                <h2 className="mb-1 text-lg font-bold text-primary">{producto.nombre}</h2>
                {producto.subtitulo && (
                  <p className="text-xs text-on-surface-variant">{producto.subtitulo}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
