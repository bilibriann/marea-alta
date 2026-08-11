import type { HomeContent } from '@/lib/home'
import { ExpandableText } from '@/components/ExpandableText'

interface Props {
  proposito: HomeContent['proposito']
  vision: string
  mision: string
}

export function PropositoSection({ proposito, vision, mision }: Props) {
  const visionParrafos = vision.split('\n\n')
  const misionParrafos = mision.split('\n\n')

  return (
    <section className="border-t border-outline-variant/20 bg-brand-crema py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-12">
        <div className="mb-16">
          <span className="mb-2 block font-mono text-label-sm font-bold uppercase tracking-widest text-tertiary">
            {proposito.eyebrow}
          </span>
          <h2 className="max-w-2xl text-headline-lg-mobile text-primary md:text-headline-xl">
            {proposito.titulo}
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.4fr]">
          <div className="rounded-md border border-outline-variant bg-white p-10">
            <h3 className="mb-6 font-mono text-label-sm font-bold uppercase tracking-widest text-tertiary">
              Visión
            </h3>
            <ExpandableText
              parrafos={visionParrafos}
              parrafoClassName="text-lg leading-relaxed text-on-surface-variant"
            />
          </div>
          <div className="rounded-md border border-outline-variant bg-white p-10">
            <h3 className="mb-6 font-mono text-label-sm font-bold uppercase tracking-widest text-tertiary">
              Misión
            </h3>
            <ExpandableText parrafos={misionParrafos} parrafoClassName="text-on-surface-variant" />
          </div>
        </div>
      </div>
    </section>
  )
}
