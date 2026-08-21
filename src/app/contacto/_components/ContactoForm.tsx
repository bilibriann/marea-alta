'use client'

import { useState, type FormEvent, type ReactNode } from 'react'
import { AlertCircle, CheckCircle2, Clock, Loader2, Mail, MapPin, Phone } from 'lucide-react'
import { siteConfig } from '@/config'
import { sendContactForm } from '@/lib/forms'

type FieldErrors = Partial<Record<'nombre' | 'email' | 'mensaje', string>>

const inputBase =
  'h-12 w-full rounded-lg border bg-white px-4 text-base text-on-background outline-none transition-colors placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-surface-container-high disabled:opacity-70'
const inputValid = 'border-outline-variant hover:border-primary/40 focus:border-primary focus:ring-primary'
const inputError = 'border-error hover:border-error focus:border-error focus:ring-error'

function ContactInfoItem({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof Mail
  label: string
  children: ReactNode
}) {
  return (
    <div className="flex items-start gap-4">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <div className="space-y-0.5">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary/70">{label}</p>
        <div className="text-base font-medium text-on-background">{children}</div>
      </div>
    </div>
  )
}

export function ContactoForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [errors, setErrors] = useState<FieldErrors>({})

  const telefonoHref = `tel:${siteConfig.contacto.telefono.replace(/[^\d+]/g, '')}`
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    siteConfig.contacto.direccion
  )}`

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
    <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[2fr_3fr] lg:gap-12">
      <div className="space-y-8 rounded-2xl bg-secondary-container/60 p-8">
        <div>
          <h2 className="text-headline-lg-mobile text-on-background">Envíanos un mensaje</h2>
          <p className="mt-2 text-sm text-on-surface-variant">
            Escríbenos y un especialista te contactará a la brevedad.
          </p>
        </div>
        <div className="space-y-6">
          <ContactInfoItem icon={Mail} label="Email">
            <a href={`mailto:${siteConfig.contacto.email}`} className="hover:text-primary hover:underline">
              {siteConfig.contacto.email}
            </a>
          </ContactInfoItem>
          <ContactInfoItem icon={Phone} label="Teléfono">
            <a href={telefonoHref} className="hover:text-primary hover:underline">
              {siteConfig.contacto.telefono}
            </a>
          </ContactInfoItem>
          <ContactInfoItem icon={MapPin} label="Dirección">
            <a
              href={mapsHref}
              target="_blank"
              rel="noreferrer noopener"
              className="hover:text-primary hover:underline"
            >
              {siteConfig.contacto.direccion}
            </a>
          </ContactInfoItem>
          <ContactInfoItem icon={Clock} label="Horario">
            {siteConfig.contacto.horario}
          </ContactInfoItem>
        </div>
      </div>

      <div className="rounded-2xl border border-outline-variant/60 bg-white p-8 shadow-md shadow-on-background/5 md:p-10">
        <form className="space-y-6" onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="nombre" className="block text-sm font-semibold text-on-background">
                Nombre
              </label>
              <input
                id="nombre"
                name="nombre"
                type="text"
                autoComplete="name"
                required
                aria-required="true"
                placeholder="Nombre completo"
                aria-invalid={Boolean(errors.nombre)}
                aria-describedby={errors.nombre ? 'nombre-error' : undefined}
                disabled={status === 'sending'}
                className={`${inputBase} ${errors.nombre ? inputError : inputValid}`}
              />
              {errors.nombre && (
                <p id="nombre-error" className="text-sm font-medium text-error">
                  {errors.nombre}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-on-background">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                aria-required="true"
                placeholder="correo@empresa.com"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'email-error' : undefined}
                disabled={status === 'sending'}
                className={`${inputBase} ${errors.email ? inputError : inputValid}`}
              />
              {errors.email && (
                <p id="email-error" className="text-sm font-medium text-error">
                  {errors.email}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="mensaje" className="block text-sm font-semibold text-on-background">
              Mensaje
            </label>
            <textarea
              id="mensaje"
              name="mensaje"
              rows={5}
              required
              aria-required="true"
              placeholder="¿Cómo podemos ayudarle con su cadena de frío?"
              aria-invalid={Boolean(errors.mensaje)}
              aria-describedby={errors.mensaje ? 'mensaje-error' : undefined}
              disabled={status === 'sending'}
              className={`w-full resize-y rounded-lg border bg-white px-4 py-3 text-base text-on-background outline-none transition-colors placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-surface-container-high disabled:opacity-70 ${errors.mensaje ? inputError : inputValid}`}
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
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-8 py-3.5 text-base font-bold text-white transition-colors hover:bg-primary-container hover:text-on-primary-container focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 active:bg-primary-container active:text-on-primary-container disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
          >
            {status === 'sending' && <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />}
            {status === 'sending' ? 'Enviando...' : 'Enviar Mensaje'}
          </button>

          {status === 'sent' && (
            <p
              role="status"
              className="flex items-center gap-3 rounded-lg border border-tertiary/30 bg-tertiary-container/40 p-4 text-sm font-medium text-tertiary"
            >
              <CheckCircle2 className="h-5 w-5 shrink-0" aria-hidden="true" />
              Mensaje enviado. Nos pondremos en contacto a la brevedad.
            </p>
          )}
          {status === 'error' && (
            <p
              role="alert"
              className="flex items-center gap-3 rounded-lg border border-error/30 bg-error-container/40 p-4 text-sm font-medium text-error"
            >
              <AlertCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
              No pudimos enviar tu mensaje. Intenta nuevamente.
            </p>
          )}
        </form>
      </div>
    </div>
  )
}
