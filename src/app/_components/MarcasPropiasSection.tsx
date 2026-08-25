import Link from 'next/link'
import type { MarcaPropia } from '@/lib/home'
import { MarcaLogo } from './MarcaLogo'
import { Reveal } from '@/components/Reveal'

interface Props {
  marcas: MarcaPropia[]
}

const basis = 'basis-[calc(50%-0.75rem)] sm:basis-44'
const card =
  'flex h-28 w-full items-center justify-center rounded-md border border-outline-variant bg-white p-6'

export function MarcasPropiasSection({ marcas }: Props) {
  if (marcas.length === 0) return null

  return (
    <section className="border-t border-white/10 bg-primary py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-12">
        <Reveal className="mb-16 text-center">
          <h2 className="linea-decorativa-centrada text-headline-lg-mobile text-white md:text-headline-xl">
            Alianzas Estratégicas
          </h2>
        </Reveal>
        {/* flex-wrap y no grid: con un número fijo de columnas, tres marcas dejan
            un hueco muerto a la derecha. Envolviendo centrado, la última fila
            queda equilibrada con las que haya. */}
        <div className="flex flex-wrap justify-center gap-6">
          {marcas.map((marca, indice) => {
            const logo = <MarcaLogo logo={marca.logo} alt={marca.alt} nombre={marca.nombre} />
            // El Reveal envuelve la ficha en vez de reemplazarla: el `basis` del
            // flex tiene que seguir viviendo en el elemento que la fila mide.
            return (
              <Reveal key={marca.slug} retraso={indice * 100} className={basis}>
                {marca.url ? (
                  <Link href={marca.url} className={`${card} tarjeta-interactiva`}>
                    {logo}
                  </Link>
                ) : (
                  <div className={card}>{logo}</div>
                )}
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
