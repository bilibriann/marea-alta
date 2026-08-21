import Image from 'next/image'
import Link from 'next/link'
import type { Sector } from '@/lib/home'

interface Props {
  sectores: Sector[]
}

export function SectoresSection({ sectores }: Props) {
  return (
    <section className="border-t border-outline-variant/20 bg-white py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-12">
        <div className="mb-16">
          <span className="mb-2 block font-mono text-label-sm font-bold uppercase tracking-widest text-tertiary">
            Expertise Vertical
          </span>
          <h2 className="text-headline-lg-mobile text-primary md:text-headline-xl">
            Sectores de Especialidad
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {sectores.map((sector) => (
            <Link
              key={sector.slug}
              href="/#contacto"
              aria-label={`Solicitar cotización para ${sector.nombre}`}
              className="group flex flex-col overflow-hidden rounded-md border border-outline-variant bg-surface-container-lowest transition-all duration-300 hover:border-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <div className="relative h-64 w-full overflow-hidden">
                <Image
                  src={sector.imagen}
                  alt={sector.nombre}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="border-t border-outline-variant/60 p-6">
                <h4 className="mb-1 text-lg font-bold text-primary">{sector.nombre}</h4>
                <p className="line-clamp-2 text-xs text-on-surface-variant">{sector.descripcion}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
