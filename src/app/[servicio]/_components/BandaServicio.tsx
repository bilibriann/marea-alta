import Image from 'next/image'
import Link from 'next/link'
import type { Servicio } from '@/lib/servicios'
import type { TemaServicio } from '@/lib/serviciosTema'
import { ArrowRightIcon } from '@/components/icons'

interface Props {
  servicio: Servicio
  tema: TemaServicio
}

export function BandaServicio({ servicio, tema }: Props) {
  return (
    <section className={tema.banda}>
      <div className="mx-auto max-w-7xl px-4 md:px-12">
        <div className="grid gap-12 py-14 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-16 lg:py-20">
          {/* Entrada escalonada, el mismo gesto que el hero de la home. Sin
              sombra en el hover del CTA: la banda es plana por contrato. */}
          <div>
            <h1
              className={`elemento-entrada text-display md:text-display-md lg:text-display-lg ${tema.titulo}`}
              style={{ animationDelay: '120ms' }}
            >
              {servicio.titulo}
            </h1>
            <p
              className={`elemento-entrada mt-6 max-w-xl text-lg leading-relaxed md:text-xl ${tema.cuerpo}`}
              style={{ animationDelay: '300ms' }}
            >
              {servicio.resumen}
            </p>
            <Link
              href="/contacto"
              style={{ animationDelay: '480ms' }}
              className={`elemento-entrada group mt-10 inline-flex w-full items-center justify-center gap-2 rounded-md px-8 py-3.5 text-base font-bold transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 sm:w-auto ${tema.boton}`}
            >
              Solicitar cotización
              <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          {/* El espacio de la foto queda reservado y vacío hasta que exista el archivo:
              sin marco, sin marca de agua, sin dibujo de relleno. */}
          {servicio.imagenDisponible ? (
            <div className="relative aspect-square w-full max-w-[420px] overflow-hidden rounded-md lg:ml-auto">
              <Image
                src={servicio.imagen}
                alt={servicio.titulo}
                fill
                priority
                sizes="(min-width: 1024px) 420px, 100vw"
                className="object-cover"
              />
            </div>
          ) : (
            <div aria-hidden="true" className="hidden aspect-square w-full max-w-[420px] lg:block" />
          )}
        </div>
      </div>
    </section>
  )
}
