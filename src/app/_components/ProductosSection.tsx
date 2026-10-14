import Link from 'next/link'
import type { Producto } from '@/lib/productos'
import { Reveal } from '@/components/Reveal'
import { TarjetaProducto } from '@/components/TarjetaProducto'

interface Props {
  productos: Producto[]
}

export function ProductosSection({ productos }: Props) {
  if (productos.length === 0) return null

  return (
    <section className="border-y border-primary/15 bg-brand-azul-profundo py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-12">
        <Reveal className="mb-16">
          <span className="mb-2 block font-mono text-label-sm font-bold uppercase tracking-widest text-primary">
            Catálogo
          </span>
          <h2 className="linea-decorativa text-headline-lg-mobile text-primary md:text-headline-xl">
            Productos
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {productos.map((producto, indice) => (
            <TarjetaProducto
              key={producto.slug}
              producto={producto}
              retraso={indice * 120}
              nivelTitulo="h3"
            />
          ))}
        </div>
        <Reveal className="mt-16 text-center">
          <Link
            href="/productos"
            className="inline-block rounded-md border border-primary px-10 py-4 font-bold text-primary transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary hover:text-white hover:shadow-lg hover:shadow-primary/25 active:translate-y-0 active:scale-95"
          >
            Ver catálogo completo
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
