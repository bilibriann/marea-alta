import Image from 'next/image'
import Link from 'next/link'
import type { HomeContent } from '@/lib/home'
import { Button } from '@/components/Button'

interface Props {
  hero: HomeContent['hero']
}

export function HeroSection({ hero }: Props) {
  return (
    <section className="relative flex h-[70vh] min-h-[480px] items-center overflow-hidden sm:h-[75vh] sm:min-h-[560px] lg:h-[85vh] lg:min-h-[600px]">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero/marealta.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center sm:object-right-bottom"
        />
      </div>
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 md:px-12">
        <div className="max-w-3xl space-y-8">
          <span className="inline-block rounded-md border border-tertiary-container bg-tertiary px-4 py-1.5 font-mono text-label-sm uppercase tracking-wider text-on-tertiary">
            {hero.badge}
          </span>
          <h1 className="text-headline-xl text-white">{hero.titulo}</h1>
          <p className="max-w-xl text-xl text-white/80">{hero.subtitulo}</p>
          <div className="flex flex-wrap gap-4 pt-4">
            <Link href={hero.ctaHref}>
              <Button variant="primary">{hero.cta}</Button>
            </Link>
            <Link href={hero.ctaSecundarioHref}>
              <Button variant="outline">{hero.ctaSecundario}</Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
