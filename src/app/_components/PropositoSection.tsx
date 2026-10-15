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
        {/* Visión y Misión lado a lado. No muestran recuadro: el borde y el
            fondo crema aparecen solo al pasar el cursor. El recuadro va en un
            div interno y no en el Reveal porque `transition-colors` pisaría la
            transición de entrada de `.al-ver-*`. */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.4fr]">
          <Reveal variante="izquierda">
            <div className={RECUADRO}>
              <h3 className="mb-4 text-headline-lg text-primary">Visión</h3>
              <ExpandableText
                parrafos={visionParrafos}
                parrafoClassName="text-lg leading-relaxed text-on-surface-variant"
              />
            </div>
          </Reveal>
          <Reveal variante="derecha" retraso={120}>
            <div className={RECUADRO}>
              <h3 className="mb-4 text-headline-lg text-primary">Misión</h3>
              <ExpandableText parrafos={misionParrafos} parrafoClassName="text-on-surface-variant" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
