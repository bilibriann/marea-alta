import Link from 'next/link'
import { siteConfig } from '@/config'
import { ArrowRightIcon } from '@/components/icons'
import { Reveal } from '@/components/Reveal'

const links = [
  { label: 'Cotización Rápida', href: '/contacto', externo: false },
  { label: 'Catálogo de Productos', href: '/productos', externo: false },
]

export function QuickLinksSection() {
  // wa.me exige el número solo con dígitos y código de país, sin '+' ni espacios.
  const whatsapp = `https://wa.me/${siteConfig.contacto.telefono.replace(/\D/g, '')}`
  const items = [...links, { label: 'Contáctanos', href: whatsapp, externo: true }]

  return (
    // Sin bordes ni divisorias y con el azul exacto de la base de las olas
    // (public/background/olas.webp): la franja se lee como continuación del hero.
    <section className="hidden bg-[#135784] md:block">
      <div className="mx-auto max-w-7xl px-4 md:px-12">
        <div className="grid grid-cols-3">
          {items.map((item, indice) => (
            <Reveal key={item.label} retraso={indice * 120}>
              <Link
                href={item.href}
                {...(item.externo && { target: '_blank', rel: 'noopener noreferrer' })}
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
