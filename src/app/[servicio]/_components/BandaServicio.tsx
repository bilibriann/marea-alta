import Link from 'next/link'
import type { Servicio } from '@/lib/servicios'
import type { TemaServicio } from '@/lib/serviciosTema'
import { ArrowRightIcon } from '@/components/icons'
import { IconoServicio } from './IconoServicio'

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
              style={{ animationDelay: '40ms' }}
            >
              {servicio.titulo}
            </h1>
            <p
              className={`elemento-entrada mt-6 max-w-xl text-lg leading-relaxed md:text-xl ${tema.cuerpo}`}
              style={{ animationDelay: '120ms' }}
            >
              {servicio.resumen}
            </p>
            {servicio.mostrarCotizacion && (
              <Link
                href="/contacto"
                style={{ animationDelay: '200ms' }}
                className={`elemento-entrada group mt-10 inline-flex w-full items-center justify-center gap-2 rounded-md px-8 py-3.5 text-base font-bold transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 sm:w-auto ${tema.boton}`}
              >
                Solicitar cotización
                <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            )}
          </div>

          {/* Panel con el motivo técnico del servicio dibujándose sobre una grilla
              de puntos, como una lámina técnica. La foto real va en el cuerpo de
              la página. En móvil se oculta para que la banda no crezca. */}
          <div
            className={`relative hidden aspect-square w-full max-w-[220px] overflow-hidden rounded-3xl border lg:ml-auto lg:mr-16 lg:flex lg:items-center lg:justify-center ${tema.linea} ${tema.titulo}`}
          >
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[radial-gradient(currentColor_1px,transparent_1px)] [background-size:22px_22px] opacity-20"
            />
            <IconoServicio slug={servicio.slug} className="relative w-1/2" />
          </div>
        </div>
      </div>
    </section>
  )
}
