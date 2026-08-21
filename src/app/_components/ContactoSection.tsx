'use client'

import { useState, type FormEvent } from 'react'
import { siteConfig } from '@/config'
import { sendContactForm } from '@/lib/forms'
import {
  CallIcon,
  MailIcon,
  PinIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  SpinnerIcon,
} from '@/components/icons'

type FieldErrors = Partial<Record<'nombre' | 'email' | 'mensaje', string>>

const inputBase =
  'h-12 w-full rounded-md border bg-white px-4 text-on-background outline-none transition-colors placeholder:text-on-surface-variant/50 focus:ring-2'
const inputValid =
  'border-outline-variant hover:border-primary/50 focus:border-primary focus:ring-primary/20'
const inputError = 'border-error hover:border-error focus:border-error focus:ring-error/20'

export function ContactoSection() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [errors, setErrors] = useState<FieldErrors>({})

  function validate(data: FormData): FieldErrors {
    const nombre = String(data.get('nombre') ?? '').trim()
    const email = String(data.get('email') ?? '').trim()
    const mensaje = String(data.get('mensaje') ?? '').trim()
    const nextErrors: FieldErrors = {}

    if (!nombre) nextErrors.nombre = 'Ingresa tu nombre completo.'
    if (!email) {
      nextErrors.email = 'Ingresa tu correo electrónico.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = 'Ingresa un correo electrónico válido.'
    }
    if (!mensaje) nextErrors.mensaje = 'Cuéntanos cómo podemos ayudarte.'

    return nextErrors
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)

    const nextErrors = validate(data)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

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
    <section id="contacto" className="scroll-mt-24 border-y border-primary/15 bg-brand-azul-profundo py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-12">
        <div className="grid grid-cols-1 gap-20 lg:grid-cols-2">
          <div className="space-y-10">
            <div className="space-y-4">
              <span className="block font-mono text-label-sm font-bold uppercase tracking-widest text-primary">
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
              <div className="flex items-center gap-4 text-primary">
                <CallIcon className="h-5 w-5 text-primary" />
                <span className="font-semibold">{siteConfig.contacto.telefono}</span>
              </div>
              <div className="flex items-center gap-4 text-primary">
                <MailIcon className="h-5 w-5 text-primary" />
                <span className="font-semibold">{siteConfig.contacto.email}</span>
              </div>
              <div className="flex items-center gap-4 text-primary">
                <PinIcon className="h-5 w-5 text-primary" />
                <span className="font-semibold">{siteConfig.contacto.direccion}</span>
              </div>
            </div>
          </div>
          <div className="bg-white p-10 md:p-14">
            <form className="space-y-8" onSubmit={handleSubmit} noValidate>
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
                    autoComplete="name"
                    placeholder="Nombre completo"
                    aria-invalid={Boolean(errors.nombre)}
                    aria-describedby={errors.nombre ? 'nombre-error' : undefined}
                    disabled={status === 'sending'}
                    className={`${inputBase} ${errors.nombre ? inputError : inputValid} disabled:cursor-not-allowed disabled:opacity-60`}
                  />
                  {errors.nombre && (
                    <p id="nombre-error" className="text-sm font-medium text-error">
                      {errors.nombre}
                    </p>
                  )}
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
                    autoComplete="email"
                    placeholder="correo@empresa.com"
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                    disabled={status === 'sending'}
                    className={`${inputBase} ${errors.email ? inputError : inputValid} disabled:cursor-not-allowed disabled:opacity-60`}
                  />
                  {errors.email && (
                    <p id="email-error" className="text-sm font-medium text-error">
                      {errors.email}
                    </p>
                  )}
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
                  placeholder="¿Cómo podemos ayudarle con su cadena de frío?"
                  aria-invalid={Boolean(errors.mensaje)}
                  aria-describedby={errors.mensaje ? 'mensaje-error' : undefined}
                  disabled={status === 'sending'}
                  className={`w-full resize-none rounded-md border bg-white px-4 py-4 text-on-background outline-none transition-colors placeholder:text-on-surface-variant/50 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 ${errors.mensaje ? inputError : inputValid}`}
                />
                {errors.mensaje && (
                  <p id="mensaje-error" className="text-sm font-medium text-error">
                    {errors.mensaje}
                  </p>
                )}
              </div>
              <button
                type="submit"
                disabled={status === 'sending'}
                className="flex w-full items-center justify-center gap-3 rounded-md bg-primary py-4 text-lg font-bold text-white transition-all hover:bg-primary-container hover:text-on-primary-container disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === 'sending' && <SpinnerIcon className="h-5 w-5 animate-spin" />}
                {status === 'sending' ? 'Enviando…' : 'Enviar Mensaje'}
              </button>
              <div aria-live="polite">
                {status === 'sent' && (
                  <p className="flex items-center gap-3 rounded-md border border-tertiary/30 bg-tertiary-container/40 p-4 text-sm font-medium text-tertiary">
                    <CheckCircleIcon className="h-5 w-5 shrink-0" />
                    Mensaje enviado. Nos pondremos en contacto a la brevedad.
                  </p>
                )}
                {status === 'error' && (
                  <p className="flex items-center gap-3 rounded-md border border-error/30 bg-error-container/40 p-4 text-sm font-medium text-error">
                    <AlertCircleIcon className="h-5 w-5 shrink-0" />
                    No pudimos enviar tu mensaje. Intenta nuevamente.
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
