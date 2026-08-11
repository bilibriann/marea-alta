import type { ComponentType, SVGProps } from 'react'
import type { HomeContent } from '@/lib/home'
import { SnowflakeIcon, HistoryIcon, VerifiedIcon, GlobeIcon } from '@/components/icons'

interface Props {
  confianza: HomeContent['confianza']
}

const ICONS: Record<
  HomeContent['confianza']['items'][number]['icono'],
  ComponentType<SVGProps<SVGSVGElement>>
> = {
  snowflake: SnowflakeIcon,
  history: HistoryIcon,
  verified: VerifiedIcon,
  globe: GlobeIcon,
}

export function ConfianzaSection({ confianza }: Props) {
  return (
    <section className="border-b border-outline-variant/20 bg-brand-crema py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-12">
        <div className="mb-16">
          <span className="mb-2 block font-mono text-label-sm font-bold uppercase tracking-widest text-tertiary">
            Servicios Core
          </span>
          <h2 className="text-headline-lg-mobile text-primary md:text-headline-xl">
            {confianza.titulo}
          </h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {confianza.items.map((item) => {
            const Icon = ICONS[item.icono]
            return (
              <div key={item.titulo} className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-outline-variant bg-primary-container/20 text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-bold text-on-surface">{item.titulo}</h3>
                  <p className="text-on-surface-variant">{item.descripcion}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
