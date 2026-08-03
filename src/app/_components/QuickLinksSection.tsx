import Link from 'next/link'
import { siteConfig } from '@/config'
import { ArrowRightIcon } from '@/components/icons'

const links = [
  { label: 'Cotización Rápida', href: '/contacto' },
  { label: 'Nuestros Servicios', href: '/servicios' },
  { label: 'Catálogo de Productos', href: '/productos' },
]

export function QuickLinksSection() {
  const items = [...links, { label: 'Llámanos', href: `tel:${siteConfig.contacto.telefono}` }]

  return (
    <section className="hidden border-y border-outline-variant/30 bg-inverse-surface md:block">
      <div className="mx-auto max-w-7xl px-4 md:px-12">
        <div className="grid grid-cols-4 divide-x divide-outline-variant/30">
          {items.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="group flex items-center justify-between p-6 transition-colors hover:bg-white/5"
            >
              <span className="font-medium text-white">{item.label}</span>
              <ArrowRightIcon className="h-5 w-5 text-primary-container transition-transform group-hover:translate-x-1" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
