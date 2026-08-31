import Image from 'next/image'
import Link from 'next/link'
import type { Producto } from '@/lib/productos'
import { Reveal } from '@/components/Reveal'

interface Props {
  producto: Producto
  /** Escalona la entrada dentro de la grilla; pásalo como `indice * 120`. */
  retraso?: number
  /**
   * Nivel del título. El catálogo cuelga de un <h1> y sus tarjetas son h2; en
   * el home la sección ya gasta el h2, así que ahí bajan a h3.
   */
  nivelTitulo?: 'h2' | 'h3'
}

/**
 * La ficha resumida de un producto dentro de una grilla. Vive en un solo lugar
 * porque estaba duplicada entre el home y el catálogo, y los arreglos de estilo
 * llegaban a una copia y no a la otra.
 */
export function TarjetaProducto({ producto, retraso = 0, nivelTitulo = 'h3' }: Props) {
  const Titulo = nivelTitulo

  return (
    <Reveal retraso={retraso} className="h-full">
      <Link
        href={`/productos/${producto.slug}`}
        className="tarjeta-interactiva group flex h-full flex-col overflow-hidden rounded-md border border-outline-variant bg-white"
      >
        {/* object-contain y no cover: las fotos son recortes con canal alfa y de
            proporciones dispares, así que recortarlas se comía media imagen. El
            padding va en la <img> y no en el contenedor: con `fill` la imagen se
            posiciona sobre la caja de padding del padre y ahí no la movería. El
            fondo blanco es de la tarjeta, y a través del alfa es lo que se ve. */}
        <div className="relative h-64 w-full overflow-hidden">
          {producto.galeria[0] ? (
            <Image
              src={producto.galeria[0]}
              alt={producto.nombre}
              fill
              className="object-contain p-6 transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full bg-surface-container" />
          )}
        </div>
        <div className="border-t border-outline-variant/60 p-6">
          <Titulo className="mb-1 text-lg font-bold text-primary">{producto.nombre}</Titulo>
          {producto.subtitulo && (
            <p className="text-xs text-on-surface-variant">{producto.subtitulo}</p>
          )}
        </div>
      </Link>
    </Reveal>
  )
}
