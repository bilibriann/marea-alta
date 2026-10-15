import Image from 'next/image'
import Link from 'next/link'
import { siteConfig } from '@/config'
import { CallIcon, MailIcon, LinkedinIcon } from '@/components/icons'

export function Footer() {
  return (
    <footer className="border-t-4 border-primary bg-inverse-surface py-20 text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 md:grid-cols-4 md:px-12">
        <div className="space-y-3">
          <Link href="/" className="inline-block shrink-0">
            <Image
              src="/logos/logo-marea-alta.png"
              alt="Marea Alta"
              width={386}
              height={118}
              className="h-14 w-auto object-contain brightness-0 invert"
            />
          </Link>
          <p className="leading-relaxed text-white/60">{siteConfig.description}</p>
        </div>
        <div className="space-y-6">
          <h4 className="text-sm font-bold uppercase tracking-widest text-accent">
            Enlaces Rápidos
          </h4>
          <ul className="space-y-4">
            {siteConfig.nav
              .filter((item) => !item.menu)
              .map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="nav-indicador inline-block text-white/70 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
          </ul>
        </div>
        <div className="space-y-6">
          <h4 className="text-sm font-bold uppercase tracking-widest text-accent">
            Contacto
          </h4>
          <div className="space-y-4">
            <p className="flex items-center gap-2 text-sm text-white/70">
              <MailIcon className="h-4 w-4 text-accent" /> {siteConfig.contacto.email}
            </p>
            <p className="flex items-center gap-2 text-sm text-white/70">
              <CallIcon className="h-4 w-4 text-accent" /> {siteConfig.contacto.telefono}
            </p>
          </div>
        </div>
        <div className="space-y-6">
          <h4 className="text-sm font-bold uppercase tracking-widest text-accent">
            Síguenos
          </h4>
          {/* LinkedIn es por ahora la única red confirmada (siteConfig.redes). */}
          <div className="flex gap-4">
            <a
              href={siteConfig.redes.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Marea Alta en LinkedIn"
              className="flex h-12 w-12 items-center justify-center rounded-md border border-white/10 bg-white/5 transition-colors hover:border-white/40 hover:bg-white/10"
            >
              <LinkedinIcon className="h-5 w-5" />
            </a>
          </div>
          <Image
            src="/logos/marca-chile.webp"
            alt="Marca Chile"
            width={360}
            height={340}
            className="mt-4 h-auto w-36"
          />
        </div>
      </div>
      <div className="mx-auto mt-20 max-w-7xl border-t border-white/10 px-4 pt-10 text-center text-sm text-white/40 md:px-12">
        © {new Date().getFullYear()} Marea Alta Chile
      </div>
    </footer>
  )
}
