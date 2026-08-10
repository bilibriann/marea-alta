type ImageLoaderProps = {
  src: string
}

export default function imageLoader({ src }: ImageLoaderProps) {
  if (/^https?:\/\//.test(src)) return src
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? ''
  return `${basePath}${src}`
}
