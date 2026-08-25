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
    <section className="relative flex min-h-[70vh] items-center overflow-hidden py-12 sm:min-h-[75vh] sm:py-20 lg:min-h-[85vh]">
      {/* El fondo y sus velos viven en una capa propia para poder animarlos
          juntos (zoom-out cinematográfico de 2.2s) sin mover el contenido. */}
      <div className="hero-fondo pointer-events-none absolute inset-0 z-0" aria-hidden="true">
        <Image
          src="/background/puerto1.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center sm:object-right-bottom"
        />
        {/* La foto viene sin tratamiento: el velo azul profundo devuelve el contraste
            del texto blanco y se apaga en la base para no ensuciar la onda de marca. */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-primary/45 to-primary/0" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/60 via-primary/25 to-transparent [mask-image:linear-gradient(to_bottom,black_65%,transparent_92%)]" />
      </div>
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 md:px-12">
        {/* Entrada escalonada: cada bloque entra 180ms después del anterior,
            de arriba hacia abajo, para que la lectura siga el mismo orden. */}
        <div className="max-w-3xl space-y-6 sm:space-y-8">
          <span
            className="elemento-entrada inline-block rounded-md border border-tertiary-container bg-tertiary px-4 py-1.5 font-mono text-label-sm uppercase tracking-wider text-on-tertiary"
            style={{ animationDelay: '200ms' }}
          >
            {hero.badge}
          </span>
          <h1
            className="elemento-entrada text-display text-white sm:text-headline-xl"
            style={{ animationDelay: '380ms' }}
          >
            {hero.titulo}
          </h1>
          <p
            className="elemento-entrada max-w-xl text-lg text-white/80 sm:text-xl"
            style={{ animationDelay: '560ms' }}
          >
            {hero.subtitulo}
          </p>
          <div
            className="elemento-entrada flex flex-col gap-4 pt-2 sm:flex-row sm:flex-wrap sm:pt-4"
            style={{ animationDelay: '740ms' }}
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
      {/* Indicador de scroll: aparece último, ya con el hero leído. Va en azul
          y no en blanco porque el velo se apaga hacia la base — abajo el fondo
          es la foto clara y una flecha blanca ahí no se lee. Solo desde `sm`:
          en móvil apaisado se comería el CTA secundario. */}
      <Link
        href="#confianza"
        aria-label="Ir a la siguiente sección"
        className="elemento-aparece absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 text-primary/70 transition-colors hover:text-primary sm:flex"
        style={{ animationDelay: '1200ms' }}
      >
        <ChevronDownIcon className="scroll-flecha h-9 w-9" aria-hidden="true" />
      </Link>
    </section>
  )
}
