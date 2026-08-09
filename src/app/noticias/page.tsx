import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getAllNoticias } from '@/lib/noticias'
import { formatFecha } from '@/lib/formatFecha'

export const metadata: Metadata = {
  title: 'Noticias',
  description: 'Noticias y novedades de Marea Alta Chile.',
}

export default async function NoticiasPage() {
  const noticias = await getAllNoticias()

  return (
    <div className="mx-auto max-w-7xl px-4 py-20 md:px-12">
      <div className="mb-16 max-w-2xl">
        <span className="mb-2 block font-mono text-label-sm font-bold uppercase tracking-widest text-tertiary">
          Novedades
        </span>
        <h1 className="text-headline-lg-mobile text-primary md:text-headline-xl">Noticias</h1>
        <p className="mt-4 text-on-surface-variant">
          Actualidad, novedades y avances de Marea Alta.
        </p>
      </div>

      {noticias.length === 0 ? (
        <p className="text-on-surface-variant">Aún no hay noticias publicadas.</p>
      ) : (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {noticias.map((noticia) => (
            <Link
              key={noticia.slug}
              href={`/noticias/${noticia.slug}`}
              className="group flex flex-col overflow-hidden border border-outline-variant transition-all duration-300 hover:border-primary"
            >
              <div className="relative h-52 overflow-hidden">
                <Image
                  src={noticia.imagen_destacada}
                  alt={noticia.titulo}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col gap-2 bg-surface-container-lowest p-6">
                <span className="font-mono text-label-sm uppercase tracking-widest text-tertiary">
                  {formatFecha(noticia.fecha)}
                </span>
                <h2 className="text-lg font-bold text-on-surface">{noticia.titulo}</h2>
                <p className="line-clamp-3 text-sm text-on-surface-variant">{noticia.extracto}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
