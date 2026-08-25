import Image from 'next/image'
import type { Distribucion } from '@/lib/home'
import { ButtonLink } from '@/components/Button'
import { Reveal } from '@/components/Reveal'

interface Props {
  distribucion: Distribucion
}

export function DistribucionSection({ distribucion }: Props) {
  return (
    // Azul profundo, un escalón bajo el azul de las marcas propias: separa las
    // dos bandas sin insertar un corte en blanco que chocaría con la sección
    // clara que viene después.
    <section className="border-y border-primary/15 bg-brand-azul-profundo py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-12">
        <Reveal className="mb-16 text-center">
          <h2 className="linea-decorativa-centrada text-headline-lg-mobile text-primary md:text-headline-xl">
            Distribuidor Estratégico Oficial
          </h2>
        </Reveal>
        <Reveal
          retraso={120}
          className="tarjeta-interactiva mx-auto flex max-w-4xl flex-col items-center gap-8 rounded-md border border-outline-variant bg-white p-8 text-center sm:flex-row sm:gap-10 sm:p-10 sm:text-left"
        >
          <div className="flex h-24 w-full shrink-0 items-center justify-center sm:w-48">
            <Image
              src={distribucion.logo}
              alt={distribucion.alt}
              width={320}
              height={128}
              className="h-auto max-h-20 w-auto max-w-full object-contain"
            />
          </div>
          <div className="space-y-4">
            <h3 className="text-headline-lg text-primary">{distribucion.nombre}</h3>
            <p className="text-body-md text-on-surface-variant">{distribucion.descripcion}</p>
            <ButtonLink
              href={distribucion.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              Visitar glutlack.cl
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
