'use client'

import { useState, type FormEvent } from 'react'
import { siteConfig } from '@/config'
import { sendContactForm } from '@/lib/forms'
import { CallIcon, MailIcon, PinIcon } from '@/components/icons'

export function ContactoSection() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    setStatus('sending')

    const result = await sendContactForm({
      nombre: String(data.get('nombre') ?? ''),
      email: String(data.get('email') ?? ''),
      mensaje: String(data.get('mensaje') ?? ''),
    })

    if (result.ok) {
      setStatus('sent')
      form.reset()
    } else {
      setStatus('error')
    }
  }

  return (
    <section className="bg-surface-dim py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-12">
        <div className="grid grid-cols-1 gap-20 lg:grid-cols-2">
          <div className="space-y-10">
            <div className="space-y-4">
              <span className="block font-mono text-label-sm font-bold uppercase tracking-widest text-tertiary">
                Contacto
              </span>
              <h2 className="text-headline-lg-mobile text-primary md:text-headline-xl">
                Inicie su Cotización
              </h2>
              <p className="max-w-md text-lg text-on-surface-variant">
                Nuestro equipo de expertos está listo para diseñar la solución de cadena de frío
                más adecuada para su negocio. Reciba una asesoría personalizada hoy mismo.
              </p>
            </div>
            <div className="space-y-6 pt-6">
              <div className="flex items-center gap-4 text-on-surface">
                <CallIcon className="h-5 w-5 text-tertiary" />
                <span className="font-semibold">{siteConfig.contacto.telefono}</span>
              </div>
              <div className="flex items-center gap-4 text-on-surface">
                <MailIcon className="h-5 w-5 text-tertiary" />
                <span className="font-semibold">{siteConfig.contacto.email}</span>
              </div>
              <div className="flex items-center gap-4 text-on-surface">
                <PinIcon className="h-5 w-5 text-tertiary" />
                <span className="font-semibold">{siteConfig.contacto.direccion}</span>
              </div>
            </div>
          </div>
          <div className="bg-white p-10 md:p-14">
            <form className="space-y-8" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div className="space-y-3">
                  <label
                    htmlFor="nombre"
                    className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant"
                  >
                    Nombre
                  </label>
                  <input
                    id="nombre"
                    name="nombre"
                    type="text"
                    required
                    placeholder="Nombre completo"
                    className="h-12 w-full rounded-none border border-outline-variant bg-white px-4 text-on-background focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="space-y-3">
                  <label
                    htmlFor="email"
                    className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="correo@empresa.com"
                    className="h-12 w-full rounded-none border border-outline-variant bg-white px-4 text-on-background focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label
                  htmlFor="mensaje"
                  className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant"
                >
                  Mensaje
                </label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  rows={5}
                  required
                  placeholder="¿Cómo podemos ayudarle con su cadena de frío?"
                  className="w-full rounded-none border border-outline-variant bg-white px-4 py-4 text-on-background focus:ring-1 focus:ring-primary"
                />
              </div>
              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full rounded-none bg-primary py-4 text-lg font-bold text-white transition-all hover:bg-primary-container hover:text-on-primary-container disabled:opacity-60"
              >
                {status === 'sending' ? 'Enviando…' : 'Enviar Mensaje'}
              </button>
              {status === 'sent' && (
                <p className="text-center text-sm font-medium text-tertiary">
                  Mensaje enviado. Nos pondremos en contacto a la brevedad.
                </p>
              )}
              {status === 'error' && (
                <p className="text-center text-sm font-medium text-error">
                  No pudimos enviar tu mensaje. Intenta nuevamente.
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
