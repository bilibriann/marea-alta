import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import ReactMarkdown, { type Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { getAllNoticias, getNoticia } from '@/lib/noticias'
import { formatFecha } from '@/lib/formatFecha'
import { ArrowRightIcon } from '@/components/icons'

export const dynamicParams = false

// Con `output: 'export'` Next aborta el build si esta lista sale vacía. Mientras
// no haya noticias se genera un único slug de relleno que no existe en
// src/content/noticias: la página llama a notFound() y queda como un 404.
const SLUG_SIN_NOTICIAS = 'sin-noticias'

export async function generateStaticParams() {
  const noticias = await getAllNoticias()
  if (noticias.length === 0) return [{ slug: SLUG_SIN_NOTICIAS }]
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
    // El meta título va tal cual (`absolute`), sin el sufijo de la plantilla.
    title: noticia.meta_titulo ? { absolute: noticia.meta_titulo } : noticia.titulo,
    description: noticia.meta_descripcion || noticia.extracto,
    keywords: noticia.palabras_clave?.length ? noticia.palabras_clave : undefined,
  }
}

const markdownComponents: Components = {
  h2: (props) => <h2 className="mt-10 mb-4 text-2xl font-bold text-on-surface" {...props} />,
  h3: (props) => <h3 className="mt-8 mb-3 text-xl font-bold text-on-surface" {...props} />,
  p: (props) => <p className="mb-4 leading-relaxed text-on-surface-variant" {...props} />,
  // Tablas (sintaxis GFM vía remark-gfm). El envoltorio permite desplazarlas
  // de lado en móvil en vez de desbordar la página.
  table: (props) => (
    <div className="my-8 overflow-x-auto rounded-md border border-outline-variant">
      <table className="w-full min-w-[540px] border-collapse text-left text-sm" {...props} />
    </div>
  ),
  thead: (props) => <thead className="bg-brand-crema" {...props} />,
  th: (props) => (
    <th
      className="border-b border-outline-variant px-4 py-3 font-mono text-label-xs font-bold uppercase tracking-widest text-primary"
      {...props}
    />
  ),
  td: (props) => (
    <td className="border-b border-outline-variant/50 px-4 py-3 text-on-surface-variant" {...props} />
  ),
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

      {/* Logo o imagen secundaria (campo `logo`, opcional): bajo el título y
          sobre la imagen destacada, en grande. Se fija el alto y el ancho sale de
          la proporción del archivo, sin pasar del ancho de la columna. */}
      {noticia.logo && (
        <Image
          src={noticia.logo}
          alt=""
          width={600}
          height={212}
          className="mt-10 h-28 w-auto max-w-full object-contain sm:h-36 md:h-44"
        />
      )}

      {/* 16:9 para que una foto apaisada se vea completa en vez de recortarse. */}
      <div className="relative mt-10 aspect-video overflow-hidden rounded-md border border-outline-variant">
        <Image
          src={noticia.imagen_destacada}
          alt={noticia.titulo}
          fill
          sizes="(min-width: 896px) 800px, 100vw"
          className="object-cover"
        />
      </div>

      <div className="mt-12 max-w-none">
        <ReactMarkdown components={markdownComponents} remarkPlugins={[remarkGfm]}>
          {noticia.contenido}
        </ReactMarkdown>
      </div>
    </div>
  )
}
