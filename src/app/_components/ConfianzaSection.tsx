import type { ComponentType, SVGProps } from 'react'
import Image from 'next/image'
import type { HomeContent } from '@/lib/home'
import { SnowflakeIcon, HistoryIcon, VerifiedIcon, GlobeIcon } from '@/components/icons'
import { Reveal } from '@/components/Reveal'

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
    // `id` para que la flecha del hero tenga a dónde apuntar.
    <section id="confianza" className="border-b border-outline-variant/20 bg-white py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-12">
        <Reveal className="mb-16">
          <span className="mb-2 block font-mono text-label-sm font-bold uppercase tracking-widest text-tertiary">
            Servicios Core
          </span>
          <h2 className="linea-decorativa text-headline-lg-mobile text-primary md:text-headline-xl">
            {confianza.titulo}
          </h2>
        </Reveal>
        {/* La foto pone cara a los pilares: va a la izquierda para leerse antes
            que la lista. Es del equipo de pie, lado a lado, así que se mantiene
            apaisada (4:3) en todos los tamaños para no cortar a nadie. */}
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          <Reveal variante="izquierda" className="mx-auto w-full max-w-md lg:col-span-5 lg:max-w-none">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-outline-variant/40">
              <Image
                src={confianza.imagen.src}
                alt={confianza.imagen.alt}
                fill
                sizes="(min-width: 1280px) 480px, (min-width: 1024px) 38vw, 448px"
                className="object-cover"
              />
            </div>
          </Reveal>
          <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:col-span-7">
            {confianza.items.map((item, indice) => {
              const Icon = ICONS[item.icono]
              return (
                // El escalonado sigue el orden de lectura de la grilla; 120ms es
                // suficiente para leerse como cascada sin hacer esperar.
                <Reveal key={item.titulo} retraso={indice * 120}>
                  <div className="item-interactivo group -m-2 flex h-full gap-4 rounded-xl p-2">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-outline-variant bg-primary-container/20 text-primary transition-colors duration-200 group-hover:border-primary group-hover:bg-primary group-hover:text-white">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="mb-2 text-xl font-bold text-on-surface">{item.titulo}</h3>
                      <p className="text-on-surface-variant">{item.descripcion}</p>
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
