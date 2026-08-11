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
  const [scrolled, setScrolled] = useState(false)

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

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 8)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={
        scrolled
          ? 'fixed top-0 z-50 w-full border-b border-outline-variant/50 bg-white/90 backdrop-blur-md transition-colors duration-300'
          : 'fixed top-0 z-50 w-full border-b border-white/10 bg-primary/95 backdrop-blur-md transition-colors duration-300'
      }
    >
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 md:px-12">
        <Link href="/" className="shrink-0">
          <Image
            src="/logos/logo-marea-alta.png"
            alt="Marea Alta"
            width={386}
            height={118}
            priority
            className={
              scrolled
                ? 'h-12 w-auto object-contain transition-all duration-300'
                : 'h-12 w-auto object-contain brightness-0 invert transition-all duration-300'
            }
          />
        </Link>
        <ul
          className={
            scrolled
              ? 'pill-nav hidden items-center gap-1 text-primary md:flex'
              : 'pill-nav hidden items-center gap-1 text-white md:flex'
          }
        >
          {siteConfig.nav.map((item) => {
            const active = pathname === item.href
            return (
              <li key={item.href} className="relative z-10">
                <Link
                  href={item.href}
                  data-active={active}
                  className={
                    scrolled
                      ? `relative block text-xs font-medium uppercase tracking-[0.08em] transition-colors duration-200 ${active ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`
                      : `relative block text-xs font-medium uppercase tracking-[0.08em] transition-colors duration-200 ${active ? 'text-white' : 'text-white/70 hover:text-white'}`
                  }
                >
                  <span className="relative z-10 inline-block rounded-full px-4 py-2">
                    {item.label}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
        <div className="flex items-center gap-2">
          <Link
            href="/contacto"
            className={
              scrolled
                ? 'rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary-container hover:text-on-primary-container active:scale-95 md:px-6 md:text-base'
                : 'rounded-md bg-white px-4 py-2.5 text-sm font-semibold text-primary transition-all hover:bg-primary-container hover:text-on-primary-container active:scale-95 md:px-6 md:text-base'
            }
          >
            Cotizar Ahora
          </Link>
          <button
            type="button"
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((value) => !value)}
            className={
              scrolled
                ? 'flex h-10 w-10 items-center justify-center border border-outline-variant text-on-background transition-colors hover:border-primary hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary md:hidden'
                : 'flex h-10 w-10 items-center justify-center border border-white/30 text-white transition-colors hover:border-white hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:hidden'
            }
          >
            {open ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
        </div>
      </nav>
      {open && (
        <div
          id="mobile-nav"
          className={
            scrolled
              ? 'border-t border-outline-variant/50 bg-white md:hidden'
              : 'border-t border-white/10 bg-primary md:hidden'
          }
        >
          <div
            className={
              scrolled
                ? 'flex flex-col divide-y divide-outline-variant/30 px-4'
                : 'flex flex-col divide-y divide-white/10 px-4'
            }
          >
            {siteConfig.nav.map((item) => {
              const active = pathname === item.href
              if (scrolled) {
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
              }
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={
                    active
                      ? 'py-4 font-bold tracking-wide text-white'
                      : 'py-4 font-bold tracking-wide text-white/70 transition-colors hover:text-white'
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
