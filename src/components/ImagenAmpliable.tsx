'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { X, ZoomIn } from 'lucide-react'

interface Props {
  src: string
  alt: string
  /** Proporción conocida de la imagen. Obligatoria salvo en modo `cubrir`. */
  width?: number
  height?: number
  /** `sizes` de la miniatura; el diálogo usa siempre el ancho grande. */
  sizes?: string
  className?: string
  /**
   * Modo galería: la miniatura llena el contenedor padre (que debe ser
   * `relative` y con alto propio) recortando con `object-cover`. La lupa
   * aparece al pasar el cursor o con el foco del teclado.
   */
  cubrir?: boolean
}

/**
 * Miniatura que se amplía en un <dialog> modal. La lámina de certificados entra
 * en el cuadro de la sección a ~450px, donde su texto es ilegible: ampliarla es
 * la única forma de leerla sin romper la grilla. El diálogo nativo ya trae
 * Escape, atrapado de foco y backdrop; aquí solo se abre, se cierra al clickear
 * fuera y se le da estilo.
 */
export function ImagenAmpliable({ src, alt, width, height, sizes, className = '', cubrir = false }: Props) {
  const dialogo = useRef<HTMLDialogElement>(null)
  // La versión grande se monta recién al abrir: dentro de un <dialog> cerrado
  // (display:none) una imagen lazy nunca dispara la carga, y una eager se
  // descargaría en cada visita aunque nadie amplíe nada.
  const [abierto, setAbierto] = useState(false)

  function abrir() {
    setAbierto(true)
    dialogo.current?.showModal()
  }

  const conProporcion = width !== undefined && height !== undefined

  return (
    <>
      {cubrir ? (
        <button
          type="button"
          onClick={abrir}
          aria-label={`Ampliar imagen: ${alt}`}
          className={`group absolute inset-0 cursor-zoom-in outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset ${className}`}
        >
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute right-2 bottom-2 flex h-9 w-9 items-center justify-center rounded-full bg-primary/90 text-on-primary shadow-md opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
          >
            <ZoomIn className="h-4.5 w-4.5" />
          </span>
        </button>
      ) : (
        <button
          type="button"
          onClick={abrir}
          aria-label={`Ampliar imagen: ${alt}`}
          className={`group relative block cursor-zoom-in rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 ${className}`}
        >
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            sizes={sizes}
            className="w-full transition-opacity duration-300 group-hover:opacity-90"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute right-2 bottom-2 flex items-center gap-1.5 rounded-full bg-primary/90 px-3 py-1.5 font-mono text-[0.625rem] font-bold tracking-widest text-on-primary uppercase opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
          >
            <ZoomIn className="h-3.5 w-3.5" />
            Ampliar
          </span>
        </button>
      )}

      <dialog
        ref={dialogo}
        onClick={(evento) => {
          if (evento.target === dialogo.current) dialogo.current.close()
        }}
        onClose={() => setAbierto(false)}
        className="m-auto w-[min(92vw,68rem)] max-w-none rounded-md border border-outline-variant bg-white p-3 backdrop:bg-on-surface/80 md:p-5"
      >
        {/* Reserva la proporción para que el diálogo no salte cuando entre la
            imagen. Sin proporción conocida, una caja de alto fijo donde la
            imagen entra completa (`object-contain`). */}
        {conProporcion ? (
          <div className="w-full" style={{ aspectRatio: `${width} / ${height}` }}>
            {abierto && (
              <Image
                src={src}
                alt={alt}
                width={width}
                height={height}
                sizes="92vw"
                loading="eager"
                className="h-full w-full object-contain"
              />
            )}
          </div>
        ) : (
          <div className="relative h-[min(80vh,48rem)] w-full">
            {abierto && (
              <Image src={src} alt={alt} fill sizes="92vw" loading="eager" className="object-contain" />
            )}
          </div>
        )}
        <button
          type="button"
          onClick={() => dialogo.current?.close()}
          aria-label="Cerrar"
          className="absolute top-5 right-5 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-on-primary transition-colors hover:bg-primary-container hover:text-on-primary-container"
        >
          <X className="h-5 w-5" />
        </button>
      </dialog>
    </>
  )
}
