import Image from 'next/image'
import type { HomeContent } from '@/lib/home'
import { ButtonLink } from '@/components/Button'

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
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
        <Image
          src="/background/puerto1.jpeg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center sm:object-right-bottom"
        />
        {/* La foto viene sin tratamiento: el velo azul profundo devuelve el contraste
            del texto blanco y se apaga en la base para no ensuciar la onda de marca. */}
        <div className="absolute inset-0 bg-gradient-to-b from-brand-azul-profundo/60 via-brand-azul-profundo/45 to-brand-azul-profundo/0" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-azul-profundo/60 via-brand-azul-profundo/25 to-transparent [mask-image:linear-gradient(to_bottom,black_65%,transparent_92%)]" />
      </div>
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 md:px-12">
        <div className="max-w-3xl space-y-6 sm:space-y-8">
          <span className="inline-block rounded-md border border-tertiary-container bg-tertiary px-4 py-1.5 font-mono text-label-sm uppercase tracking-wider text-on-tertiary">
            {hero.badge}
          </span>
          <h1 className="text-display text-white sm:text-headline-xl">{hero.titulo}</h1>
          <p className="max-w-xl text-lg text-white/80 sm:text-xl">{hero.subtitulo}</p>
          <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:flex-wrap sm:pt-4">
            <ButtonLink href={hero.ctaHref} variant="primary" className="w-full sm:w-auto">
              {hero.cta}
            </ButtonLink>
            <ButtonLink href={hero.ctaSecundarioHref} variant="outline" className="w-full sm:w-auto">
              {hero.ctaSecundario}
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  )
}
