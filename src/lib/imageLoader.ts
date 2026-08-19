import { assetPath } from './assetPath'

type ImageLoaderProps = {
  src: string
}

export default function imageLoader({ src }: ImageLoaderProps) {
  return assetPath(src)
}
