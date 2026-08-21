import Link from 'next/link'
import type { MarcaPropia } from '@/lib/home'
import { MarcaLogo } from './MarcaLogo'

interface Props {
  marcas: MarcaPropia[]
}

const card =
  'flex h-28 basis-[calc(50%-0.75rem)] items-center justify-center rounded-md border border-outline-variant bg-white p-6 sm:basis-44'

export function MarcasPropiasSection({ marcas }: Props) {
  if (marcas.length === 0) return null

  return (
    <section className="border-t border-white/10 bg-primary py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-12">
        <div className="mb-16 text-center">
          <h2 className="text-headline-lg-mobile text-white md:text-headline-xl">Alianzas Estratégicas</h2>
        </div>
        {/* flex-wrap y no grid: con un número fijo de columnas, tres marcas dejan
            un hueco muerto a la derecha. Envolviendo centrado, la última fila
            queda equilibrada con las que haya. */}
        <div className="flex flex-wrap justify-center gap-6">
          {marcas.map((marca) =>
            marca.url ? (
              <Link key={marca.slug} href={marca.url} className={`${card} transition-shadow hover:shadow-lg`}>
                <MarcaLogo logo={marca.logo} alt={marca.alt} nombre={marca.nombre} />
              </Link>
            ) : (
              <div key={marca.slug} className={card}>
                <MarcaLogo logo={marca.logo} alt={marca.alt} nombre={marca.nombre} />
              </div>
            )
          )}
        </div>
      </div>
    </section>
  )
}
