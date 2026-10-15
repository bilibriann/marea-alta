import Image from 'next/image'
import Link from 'next/link'
import type { Noticia } from '@/lib/noticias'
import { formatFecha } from '@/lib/formatFecha'
import { Reveal } from '@/components/Reveal'

interface Props {
  noticias: Noticia[]
}

export function NoticiasSection({ noticias }: Props) {
  if (noticias.length === 0) return null
  const [destacada, ...resto] = noticias.slice(0, 3)

  return (
    <section className="border-t border-white/10 bg-primary py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-12">
        <Reveal className="mb-16">
          <span className="mb-2 block font-mono text-label-sm font-bold uppercase tracking-widest text-accent">
            Novedades
          </span>
          <h2 className="linea-decorativa text-headline-lg-mobile text-white md:text-headline-xl">
            Noticias
          </h2>
        </Reveal>
        {/* La más reciente va destacada a todo el ancho (imagen grande a la
            izquierda, texto a la derecha); las dos siguientes, debajo en dos
            columnas. Con una sola noticia, la tarjeta no queda en un tercio
            del ancho. */}
        {destacada && (
          <Reveal>
            <Link
              href={`/noticias/${destacada.slug}`}
              className="tarjeta-interactiva tarjeta-interactiva-oscura group flex flex-col overflow-hidden rounded-md border border-white/10 lg:flex-row"
            >
              <div className="relative aspect-video overflow-hidden lg:w-3/5">
                <Image
                  src={destacada.imagen_destacada}
                  alt={destacada.titulo}
                  fill
                  sizes="(min-width: 1024px) 60vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col justify-center gap-4 bg-white p-8 md:p-10">
                <span className="font-mono text-label-sm uppercase tracking-widest text-tertiary">
                  {formatFecha(destacada.fecha)}
                </span>
                <h3 className="text-headline-lg-mobile text-on-surface md:text-headline-lg">
                  {destacada.titulo}
                </h3>
                <p className="line-clamp-5 text-base leading-relaxed text-on-surface-variant md:text-lg">
                  {destacada.extracto}
                </p>
              </div>
            </Link>
          </Reveal>
        )}
        {resto.length > 0 && (
          <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
            {resto.map((noticia, indice) => (
              <Reveal key={noticia.slug} retraso={indice * 120} className="h-full">
                <Link
                  href={`/noticias/${noticia.slug}`}
                  className="tarjeta-interactiva tarjeta-interactiva-oscura group flex h-full flex-col overflow-hidden rounded-md border border-white/10"
                >
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={noticia.imagen_destacada}
                      alt={noticia.titulo}
                      fill
                      sizes="(min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-3 bg-white p-8">
                    <span className="font-mono text-label-sm uppercase tracking-widest text-tertiary">
                      {formatFecha(noticia.fecha)}
                    </span>
                    <h3 className="text-xl font-bold text-on-surface">{noticia.titulo}</h3>
                    <p className="line-clamp-3 text-base text-on-surface-variant">{noticia.extracto}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
        <Reveal className="mt-16 text-center">
          <Link
            href="/noticias"
            className="inline-block rounded-md border border-white px-10 py-4 font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-white hover:text-primary hover:shadow-lg hover:shadow-primary/40 active:translate-y-0 active:scale-95"
          >
            Ver todas las noticias
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
