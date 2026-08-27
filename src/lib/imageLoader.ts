import { assetPath } from './assetPath'

type ImageLoaderProps = {
  src: string
  width: number
}

/**
 * El sitio se exporta estático: no hay optimizador que redimensione nada, así que el
 * loader solo antepone el basePath. El ancho viaja igual en la query — no cambia el
 * archivo que sirve el host, pero next/image exige una URL distinta por ancho y sin
 * ella avisa en cada render que el loader "no implementa width".
 */
export default function imageLoader({ src, width }: ImageLoaderProps) {
  const url = assetPath(src)
  return `${url}${url.includes('?') ? '&' : '?'}w=${width}`
}
