'use client'

import Image from 'next/image'
import { useState } from 'react'

interface Props {
  logo: string
  alt: string
  nombre: string
}

/**
 * El logo de una marca dentro de una caja de alto fijo. Si el archivo falta o
 * falla al cargar, cae a un wordmark con el nombre: un <img> roto pinta su alt
 * en texto crudo al tamaño natural y desarma la fila entera.
 */
export function MarcaLogo({ logo, alt, nombre }: Props) {
  const [falló, setFalló] = useState(false)

  if (!logo || falló) {
    return (
      <span className="text-center font-mono text-label-sm font-bold uppercase tracking-wider text-primary">
        {nombre}
      </span>
    )
  }

  return (
    <Image
      src={logo}
      alt={alt}
      width={240}
      height={96}
      onError={() => setFalló(true)}
      className="h-auto max-h-14 w-auto max-w-full object-contain grayscale transition-all duration-300 hover:grayscale-0"
    />
  )
}
