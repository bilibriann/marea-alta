'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { siteConfig } from '@/config'

export function Header() {
  const pathname = usePathname()

  return (
    <header className="fixed top-0 z-50 w-full border-b border-outline-variant/50 bg-white/90 backdrop-blur-md">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 md:px-12">
        <Link href="/" className="text-xl font-bold text-on-background">
          marea<span className="text-primary">alta</span>
        </Link>
        <div className="hidden items-center gap-8 md:flex">
          {siteConfig.nav.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  active
                    ? 'border-b-2 border-primary pb-1 font-semibold text-primary'
                    : 'text-on-surface-variant transition-colors duration-200 hover:text-primary'
                }
              >
                {item.label}
              </Link>
            )
          })}
        </div>
        <Link
          href="/contacto"
          className="rounded-none bg-primary px-6 py-2.5 font-semibold text-white transition-all hover:bg-primary-container hover:text-on-primary-container active:scale-95"
        >
          Cotizar Ahora
        </Link>
      </nav>
    </header>
  )
}
