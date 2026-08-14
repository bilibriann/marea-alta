import Image from 'next/image'
import Link from 'next/link'
import type { Producto } from '@/lib/productos'

interface Props {
  productos: Producto[]
}

export function ProductosSection({ productos }: Props) {
  if (productos.length === 0) return null

  return (
    <section className="border-t border-white/10 bg-brand-azul-profundo py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-12">
        <div className="mb-16">
          <span className="mb-2 block font-mono text-label-sm font-bold uppercase tracking-widest text-accent">
            Catálogo
          </span>
          <h2 className="text-headline-lg-mobile text-white md:text-headline-xl">Productos</h2>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {productos.map((producto) => (
            <Link
              key={producto.slug}
              href={`/productos/${producto.slug}`}
              className="group relative h-80 overflow-hidden rounded-md border border-outline-variant transition-all duration-300 hover:border-primary"
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
                <h3 className="mb-1 text-lg font-bold text-white">{producto.nombre}</h3>
                {producto.subtitulo && <p className="text-xs text-white/70">{producto.subtitulo}</p>}
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-16 text-center">
          <Link
            href="/productos"
            className="inline-block rounded-md border border-white px-10 py-4 font-bold text-white transition-all hover:bg-white hover:text-brand-azul-profundo"
          >
            Ver catálogo completo
          </Link>
        </div>
      </div>
    </section>
  )
}
