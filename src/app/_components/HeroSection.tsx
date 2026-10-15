import Image from 'next/image'
import Link from 'next/link'
import type { HomeContent } from '@/lib/home'
import { ButtonLink } from '@/components/Button'
import { ChevronDownIcon } from '@/components/icons'

interface Props {
  hero: HomeContent['hero']
}

export function HeroSection({ hero }: Props) {
  return (
    // Altura fluida, no fija: en pantallas angostas el titular envuelve a más
    // líneas y la columna crece. Con `h-[70vh]` + `overflow-hidden` el CTA
    // secundario quedaba recortado fuera de la sección (hasta 71px en 320px de
    // ancho) y lo tapaba la sección blanca siguiente.
    // El padding inferior reserva el alto de las olas para que el CTA no quede
    // encima de ellas.
    <section className="relative flex min-h-[70vh] items-center overflow-hidden pb-28 pt-12 sm:min-h-[75vh] sm:pb-40 sm:pt-20 lg:min-h-[85vh] lg:pb-64">
      {/* El fondo y su velo viven en una capa propia para poder animarlos
          juntos (zoom-out de 1.2s) sin mover el contenido. */}
      <div className="hero-fondo pointer-events-none absolute inset-0 z-0" aria-hidden="true">
        <Image
          src="/background/foto-principal.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* La foto va en su color original; el velo lateral azul da contraste al texto. */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/55 via-primary/20 to-transparent" />
      </div>
      {/* Las olas van en una capa aparte y no dentro de la foto: así quedan
          siempre pegadas a la base y a todo el ancho, sin que `object-cover` las
          recorte en móvil. Se estiran (`object-fill`) porque son formas lisas y
          lo toleran; la altura se topa para que en pantallas anchas no tapen el
          contenido. `-bottom-px` evita una línea de la foto bajo el borde. */}
      <div
        className="pointer-events-none absolute inset-x-0 -bottom-px z-0 h-[22vw] max-h-64 min-h-20"
        aria-hidden="true"
      >
        <Image src="/background/olas.webp" alt="" fill priority sizes="100vw" className="object-fill" />
      </div>
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 md:px-12">
        {/* Entrada escalonada: cada bloque entra 80ms después del anterior,
            de arriba hacia abajo, para que la lectura siga el mismo orden. */}
        <div className="max-w-3xl space-y-6 sm:space-y-8">
          <span
            className="elemento-entrada inline-block rounded-md border border-tertiary-container bg-tertiary px-4 py-1.5 font-mono text-label-sm uppercase tracking-wider text-on-tertiary"
            style={{ animationDelay: '60ms' }}
          >
            {hero.badge}
          </span>
          <h1
            className="elemento-entrada text-display text-white sm:text-headline-xl"
            style={{ animationDelay: '140ms' }}
          >
            {hero.titulo}
          </h1>
          <p
            className="elemento-entrada max-w-xl text-lg text-white/80 sm:text-xl"
            style={{ animationDelay: '220ms' }}
          >
            {hero.subtitulo}
          </p>
          <div
            className="elemento-entrada flex flex-col gap-4 pt-2 sm:flex-row sm:flex-wrap sm:pt-4"
            style={{ animationDelay: '300ms' }}
          >
            <ButtonLink href={hero.ctaHref} variant="primary" className="w-full sm:w-auto">
              {hero.cta}
            </ButtonLink>
            <ButtonLink href={hero.ctaSecundarioHref} variant="white" className="w-full sm:w-auto">
              {hero.ctaSecundario}
            </ButtonLink>
          </div>
        </div>
      </div>
      {/* Indicador de scroll: aparece último, ya con el hero leído. Va en blanco
          porque la base de la foto es la franja azul de la onda. Solo desde
          `sm`: en móvil apaisado se comería el CTA secundario. */}
      <Link
        href="#confianza"
        aria-label="Ir a la siguiente sección"
        className="elemento-aparece absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 text-white/70 transition-colors hover:text-white sm:flex"
        style={{ animationDelay: '600ms' }}
      >
        <ChevronDownIcon className="scroll-flecha h-9 w-9" aria-hidden="true" />
      </Link>
    </section>
  )
}
