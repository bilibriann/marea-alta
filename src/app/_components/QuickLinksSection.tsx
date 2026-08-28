import Link from 'next/link'
import { siteConfig } from '@/config'
import { ArrowRightIcon } from '@/components/icons'
import { Reveal } from '@/components/Reveal'

const links = [
  { label: 'Cotización Rápida', href: '/contacto' },
  { label: 'Catálogo de Productos', href: '/productos' },
]

export function QuickLinksSection() {
  const items = [...links, { label: 'Llámanos', href: `tel:${siteConfig.contacto.telefono}` }]

  return (
    <section className="hidden border-y border-outline-variant/30 bg-inverse-surface md:block">
      <div className="mx-auto max-w-7xl px-4 md:px-12">
        <div className="grid grid-cols-3 divide-x divide-outline-variant/30">
          {items.map((item, indice) => (
            <Reveal key={item.label} retraso={indice * 120}>
              <Link
                href={item.href}
                className="item-interactivo-oscuro group flex h-full items-center justify-between p-6"
              >
                <span className="font-medium text-white">{item.label}</span>
                <ArrowRightIcon className="h-5 w-5 text-primary-container transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
