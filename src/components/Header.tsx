'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { siteConfig } from '@/config'
import { CloseIcon, MenuIcon } from '@/components/icons'

export function Header() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [lastPathname, setLastPathname] = useState(pathname)

  if (pathname !== lastPathname) {
    setLastPathname(pathname)
    setOpen(false)
  }

  useEffect(() => {
    if (!open) return
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open])

  return (
    <header className="fixed top-0 z-50 w-full border-b border-outline-variant/50 bg-white/90 backdrop-blur-md">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 md:px-12">
        <Link href="/" className="shrink-0">
          <Image
            src="/logos/logo-marea-alta.png"
            alt="Marea Alta"
            width={386}
            height={118}
            priority
            className="h-9 w-auto object-contain"
          />
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
                    ? 'border-b border-primary pb-1 text-xs font-medium uppercase tracking-[0.08em] text-primary'
                    : 'text-xs font-medium uppercase tracking-[0.08em] text-on-surface-variant transition-colors duration-200 hover:text-primary'
                }
              >
                {item.label}
              </Link>
            )
          })}
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/contacto"
            className="rounded-none bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary-container hover:text-on-primary-container active:scale-95 md:px-6 md:text-base"
          >
            Cotizar Ahora
          </Link>
          <button
            type="button"
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((value) => !value)}
            className="flex h-10 w-10 items-center justify-center border border-outline-variant text-on-background transition-colors hover:border-primary hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary md:hidden"
          >
            {open ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
        </div>
      </nav>
      {open && (
        <div id="mobile-nav" className="border-t border-outline-variant/50 bg-white md:hidden">
          <div className="flex flex-col divide-y divide-outline-variant/30 px-4">
            {siteConfig.nav.map((item) => {
              const active = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={
                    active
                      ? 'py-4 font-bold tracking-wide text-primary'
                      : 'py-4 font-bold tracking-wide text-on-surface transition-colors hover:text-primary'
                  }
                >
                  {item.label}
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </header>
  )
}
