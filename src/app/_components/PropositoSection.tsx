import type { HomeContent } from '@/lib/home'
import { ExpandableText } from '@/components/ExpandableText'
import { Reveal } from '@/components/Reveal'

interface Props {
  proposito: HomeContent['proposito']
  vision: string
  mision: string
}

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
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.4fr]">
          <Reveal
            variante="izquierda"
            className="tarjeta-interactiva h-full rounded-md border border-outline-variant bg-white p-10"
          >
            <h3 className="mb-6 font-mono text-label-sm font-bold uppercase tracking-widest text-tertiary">
              Visión
            </h3>
            <ExpandableText
              parrafos={visionParrafos}
              parrafoClassName="text-lg leading-relaxed text-on-surface-variant"
            />
          </Reveal>
          <Reveal
            variante="derecha"
            retraso={120}
            className="tarjeta-interactiva h-full rounded-md border border-outline-variant bg-white p-10"
          >
            <h3 className="mb-6 font-mono text-label-sm font-bold uppercase tracking-widest text-tertiary">
              Misión
            </h3>
            <ExpandableText parrafos={misionParrafos} parrafoClassName="text-on-surface-variant" />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
