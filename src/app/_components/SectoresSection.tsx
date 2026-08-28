import Image from 'next/image'
import Link from 'next/link'
import type { Sector } from '@/lib/home'
import { Reveal } from '@/components/Reveal'

interface Props {
  sectores: Sector[]
}

export function SectoresSection({ sectores }: Props) {
  return (
    <section className="border-t border-outline-variant/20 bg-white py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-12">
        <Reveal className="mb-16">
          <span className="mb-2 block font-mono text-label-sm font-bold uppercase tracking-widest text-tertiary">
            Expertise Vertical
          </span>
          <h2 className="linea-decorativa text-headline-lg-mobile text-primary md:text-headline-xl">
            Sectores de Especialidad
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {sectores.map((sector, indice) => (
            <Reveal key={sector.slug} retraso={indice * 120} className="h-full">
            <Link
              href="/#contacto"
              aria-label={`Solicitar cotización para ${sector.nombre}`}
              className="tarjeta-interactiva group flex h-full flex-col overflow-hidden rounded-md border border-outline-variant bg-surface-container-lowest"
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
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
