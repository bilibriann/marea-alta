import Image from 'next/image'
import type { HomeContent } from '@/lib/home'
import { ExpandableText } from '@/components/ExpandableText'
import { Reveal } from '@/components/Reveal'

interface Props {
  proposito: HomeContent['proposito']
  vision: string
  mision: string
}

const RECUADRO =
  'rounded-md border border-transparent p-10 transition-colors duration-300 hover:border-outline-variant hover:bg-brand-crema'

export function PropositoSection({ proposito, vision, mision }: Props) {
  const visionParrafos = vision.split('\n\n')
  const misionParrafos = mision.split('\n\n')

  return (
    <section className="border-t border-outline-variant/20 bg-white py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-12">
        <Reveal className="mb-16">
          <span className="mb-2 block font-mono text-label-sm font-bold uppercase tracking-widest text-tertiary">
            {proposito.eyebrow}
          </span>
          <h2 className="linea-decorativa max-w-2xl text-headline-lg-mobile text-primary md:text-headline-xl">
            {proposito.titulo}
          </h2>
        </Reveal>
        {/* Las tarjetas mandan a la izquierda y la foto las acompaña a la
            derecha, en una columna angosta y centrada respecto de ellas. La
            foto es estática: sin `sticky` ni animación de entrada. */}
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="flex flex-col gap-6 lg:col-span-7">
            {/* Visión y Misión no muestran recuadro: el borde y el fondo crema
                aparecen solo al pasar el cursor. Va en un div interno y no en el
                Reveal porque `transition-colors` pisaría la transición de entrada
                de `.al-ver-izq`. */}
            <Reveal variante="izquierda">
              <div className={RECUADRO}>
                <h3 className="mb-4 text-headline-lg text-primary">
                  Visión
                </h3>
                <ExpandableText
                  parrafos={visionParrafos}
                  parrafoClassName="text-lg leading-relaxed text-on-surface-variant"
                />
              </div>
            </Reveal>
            <Reveal variante="izquierda" retraso={120}>
              <div className={RECUADRO}>
                <h3 className="mb-4 text-headline-lg text-primary">
                  Misión
                </h3>
                <ExpandableText parrafos={misionParrafos} parrafoClassName="text-on-surface-variant" />
              </div>
            </Reveal>
          </div>
          <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-3xl border border-outline-variant/40 lg:col-span-5">
            <Image
              src={proposito.imagen.src}
              alt={proposito.imagen.alt}
              fill
              sizes="(min-width: 1024px) 35vw, 448px"
              className="object-cover object-[50%_40%]"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
