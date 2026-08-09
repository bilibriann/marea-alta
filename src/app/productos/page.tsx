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
              className="group relative h-80 overflow-hidden border border-outline-variant transition-all duration-300 hover:border-primary"
            >
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
              <div className="absolute inset-0 bg-inverse-surface/70 transition-colors group-hover:bg-inverse-surface/50" />
              <div className="absolute bottom-0 left-0 w-full border-t border-white/10 bg-inverse-surface/90 p-6">
                <h2 className="mb-1 text-lg font-bold text-white">{producto.nombre}</h2>
                {producto.subtitulo && <p className="text-xs text-white/70">{producto.subtitulo}</p>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
