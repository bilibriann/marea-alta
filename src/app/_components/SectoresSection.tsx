import Image from 'next/image'
import Link from 'next/link'
import type { Sector } from '@/lib/home'

interface Props {
  sectores: Sector[]
}

export function SectoresSection({ sectores }: Props) {
  return (
    <section className="border-t border-outline-variant/20 bg-brand-crema py-24">
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
              className="group relative block h-80 overflow-hidden rounded-md border border-outline-variant transition-all duration-300 hover:border-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <Image
                src={sector.imagen}
                alt={sector.nombre}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-inverse-surface/70 transition-colors group-hover:bg-inverse-surface/50" />
              <div className="absolute bottom-0 left-0 w-full border-t border-white/10 bg-inverse-surface/90 p-6">
                <h4 className="mb-1 text-lg font-bold text-white">{sector.nombre}</h4>
                <p className="line-clamp-2 text-xs text-white/70">{sector.descripcion}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
