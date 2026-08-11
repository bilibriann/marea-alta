import type { Metadata } from 'next'
import { ContactoForm } from './_components/ContactoForm'

export const metadata: Metadata = {
  title: 'Contacto',
  description: 'Contáctenos para consultas sobre nuestros productos y servicios.',
}

export default function ContactoPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-24 md:px-12">
      <div className="mb-16 max-w-2xl">
        <span className="mb-2 block font-mono text-label-sm font-bold uppercase tracking-widest text-tertiary">
          Contacto
        </span>
        <h1 className="text-headline-lg-mobile text-primary md:text-headline-xl">Contáctanos</h1>
      </div>
      <ContactoForm />
    </div>
  )
}
