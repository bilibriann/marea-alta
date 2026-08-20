import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import ReactMarkdown, { type Components } from 'react-markdown'
import { getAllNoticias, getNoticia } from '@/lib/noticias'
import { formatFecha } from '@/lib/formatFecha'
import { ArrowRightIcon } from '@/components/icons'

export const dynamicParams = false

export async function generateStaticParams() {
  const noticias = await getAllNoticias()
  // Un array vacío rompe el build entero con `output: 'export'` (bug conocido
  // de Next.js, ver vercel/next.js#58171) — si no hay noticias publicadas,
  // generamos un slug que nunca va a coincidir con uno real; getNoticia()
  // devuelve null y la página ya llama notFound() para ese caso.
  if (noticias.length === 0) return [{ slug: '__placeholder__' }]
  return noticias.map((n) => ({ slug: n.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const noticia = await getNoticia(slug)
  if (!noticia) return {}
  return {
    title: noticia.titulo,
    description: noticia.extracto,
  }
}

const markdownComponents: Components = {
  h2: (props) => <h2 className="mt-10 mb-4 text-2xl font-bold text-on-surface" {...props} />,
  h3: (props) => <h3 className="mt-8 mb-3 text-xl font-bold text-on-surface" {...props} />,
  p: (props) => <p className="mb-4 leading-relaxed text-on-surface-variant" {...props} />,
  ul: (props) => (
    <ul className="mb-4 list-disc space-y-2 pl-6 text-on-surface-variant" {...props} />
  ),
  strong: (props) => <strong className="font-bold text-on-surface" {...props} />,
  a: (props) => (
    <a className="text-primary underline hover:text-primary-container" {...props} />
  ),
  img: ({ src, alt }) => {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? ''
    const resolvedSrc =
      typeof src === 'string' && src.startsWith('/') ? `${basePath}${src}` : src
    return (
      <span className="my-8 block overflow-hidden border border-outline-variant">
        {/* eslint-disable-next-line @next/next/no-img-element -- markdown images have unknown dimensions, incompatible with next/image */}
        <img src={typeof resolvedSrc === 'string' ? resolvedSrc : undefined} alt={alt ?? ''} className="w-full object-cover" />
      </span>
    )
  },
}

export default async function NoticiaPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const noticia = await getNoticia(slug)
  if (!noticia) notFound()

  return (
    <div className="mx-auto max-w-4xl px-4 py-20 md:px-12">
      <Link
        href="/noticias"
        className="mb-10 inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-container"
      >
        <ArrowRightIcon className="h-4 w-4 rotate-180" />
        Volver a Noticias
      </Link>

      <span className="mb-2 block font-mono text-label-sm font-bold uppercase tracking-widest text-tertiary">
        {formatFecha(noticia.fecha)}
      </span>
      <h1 className="text-headline-lg-mobile text-primary md:text-headline-xl">
        {noticia.titulo}
      </h1>

      {noticia.imagen_destacada && (
        <div className="relative mt-10 h-80 overflow-hidden border border-outline-variant sm:h-96">
          <Image src={noticia.imagen_destacada} alt={noticia.titulo} fill className="object-cover" />
        </div>
      )}

      <div className="mt-12 max-w-none">
        <ReactMarkdown components={markdownComponents}>{noticia.contenido}</ReactMarkdown>
      </div>
    </div>
  )
}
