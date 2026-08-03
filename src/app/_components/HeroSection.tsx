import Image from 'next/image'
import Link from 'next/link'
import type { HomeContent } from '@/lib/home'
import { Button } from '@/components/Button'

interface Props {
  hero: HomeContent['hero']
}

export function HeroSection({ hero }: Props) {
  return (
    <section className="relative flex h-[85vh] min-h-[600px] items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image src="/images/hero/hero-bg.webp" alt="" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-linear-to-r from-[#0f1c2d]/85 to-[#0f1c2d]/40" />
      </div>
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 md:px-12">
        <div className="max-w-3xl space-y-8">
          <span className="inline-block rounded-none border border-tertiary-container bg-tertiary px-4 py-1.5 font-mono text-label-sm uppercase tracking-wider text-on-tertiary">
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
