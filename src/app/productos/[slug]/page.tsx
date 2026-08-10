import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getAllProductos, getProducto } from '@/lib/productos'
import { ArrowRightIcon } from '@/components/icons'
import { CotizacionForm } from '../_components/CotizacionForm'

export const dynamicParams = false

function getYoutubeEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url)
    if (parsed.hostname === 'youtu.be') {
      return `https://www.youtube.com/embed${parsed.pathname}`
    }
    if (parsed.hostname.includes('youtube.com')) {
      const id = parsed.searchParams.get('v')
      if (id) return `https://www.youtube.com/embed/${id}`
      if (parsed.pathname.startsWith('/embed/')) return url
    }
    return null
  } catch {
    return null
  }
}

export async function generateStaticParams() {
  const productos = await getAllProductos()
  return productos.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const producto = await getProducto(slug)
  if (!producto) return {}
  return {
    title: producto.nombre,
    description: producto.subtitulo ?? producto.nombre,
  }
}

export default async function ProductoPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const producto = await getProducto(slug)
  if (!producto) notFound()

  const videoEmbedUrl = producto.video_youtube ? getYoutubeEmbedUrl(producto.video_youtube) : null

  return (
    <div className="mx-auto max-w-5xl px-4 py-20 md:px-12">
      <Link
        href="/productos"
        className="mb-10 inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-container"
      >
        <ArrowRightIcon className="h-4 w-4 rotate-180" />
        Volver a Productos
      </Link>

      <span className="mb-2 block font-mono text-label-sm font-bold uppercase tracking-widest text-tertiary">
        Producto
      </span>
      <h1 className="text-headline-lg-mobile text-primary md:text-headline-xl">{producto.nombre}</h1>
      {producto.subtitulo && (
        <p className="mt-2 text-lg text-on-surface-variant">{producto.subtitulo}</p>
      )}

      {producto.galeria.length > 0 && (
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {producto.galeria.map((imagen) => (
            <div
              key={imagen}
              className="relative h-64 overflow-hidden border border-outline-variant"
            >
              <Image src={imagen} alt={producto.nombre} fill className="object-cover" />
            </div>
          ))}
        </div>
      )}

      {producto.grupos_opciones.length > 0 && (
        <div className="mt-16 space-y-10">
          {producto.grupos_opciones.map((grupo) => (
            <div key={grupo.titulo_grupo}>
              <h2 className="mb-4 text-xl font-bold text-on-surface">{grupo.titulo_grupo}</h2>
              <div className="flex flex-wrap gap-3">
                {grupo.opciones.map((opcion) => (
                  <span
                    key={opcion}
                    className="border border-outline-variant bg-surface-container-low px-4 py-2 text-sm text-on-surface-variant"
                  >
                    {opcion}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {producto.nota_adicional && (
        <p className="mt-16 border-t border-outline-variant/30 pt-6 text-sm italic text-on-surface-variant">
          {producto.nota_adicional}
        </p>
      )}

      <div className="mt-20 border-t border-outline-variant/30 pt-16">
        <span className="mb-2 block font-mono text-label-sm font-bold uppercase tracking-widest text-tertiary">
          Cotización
        </span>
        <h2 className="mb-8 text-headline-lg-mobile text-primary md:text-headline-xl">
          Solicita tu Cotización
        </h2>
        <CotizacionForm producto={producto.nombre} cantidades={producto.opciones_cantidad} />
      </div>

      {videoEmbedUrl && (
        <div className="relative mt-16 aspect-video overflow-hidden border border-outline-variant">
          <iframe
            src={videoEmbedUrl}
            title={`Video de ${producto.nombre}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        </div>
      )}
    </div>
  )
}
