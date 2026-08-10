'use client'

import { useState, type FormEvent } from 'react'
import { Button } from '@/components/Button'
import { sendCotizacionForm } from '@/lib/forms'

interface Props {
  producto: string
  cantidades: string[]
}

type Status = 'idle' | 'loading' | 'success' | 'error'

const inputClass =
  'w-full border border-outline-variant bg-surface-container-lowest px-4 py-3 text-on-surface placeholder:text-on-surface-variant/60 focus:border-primary focus:outline-none'

export function CotizacionForm({ producto, cantidades }: Props) {
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)

    setStatus('loading')
    setError(null)

    const result = await sendCotizacionForm({
      nombre: String(data.get('nombre') ?? ''),
      apellido: String(data.get('apellido') ?? ''),
      email: String(data.get('email') ?? ''),
      mensaje: String(data.get('mensaje') ?? ''),
      producto,
      cantidades: data.getAll('cantidades').map(String),
    })

    if (result.ok) {
      setStatus('success')
      form.reset()
    } else {
      setStatus('error')
      setError(result.error ?? 'No se pudo enviar la cotización.')
    }
  }

  if (status === 'success') {
    return (
      <div className="border border-tertiary bg-tertiary-container/10 p-8 text-center">
        <p className="font-semibold text-tertiary">
          ¡Listo! Recibimos tu solicitud de cotización, te contactaremos a la brevedad.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="nombre" className="mb-2 block text-sm font-medium text-on-surface">
            Nombre
          </label>
          <input id="nombre" name="nombre" type="text" required className={inputClass} />
        </div>
        <div>
          <label htmlFor="apellido" className="mb-2 block text-sm font-medium text-on-surface">
            Apellido
          </label>
          <input id="apellido" name="apellido" type="text" required className={inputClass} />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-medium text-on-surface">
          Email
        </label>
        <input id="email" name="email" type="email" required className={inputClass} />
      </div>

      <div>
        <label htmlFor="mensaje" className="mb-2 block text-sm font-medium text-on-surface">
          Mensaje
        </label>
        <textarea id="mensaje" name="mensaje" rows={4} required className={inputClass} />
      </div>

      {cantidades.length > 0 && (
        <div>
          <span className="mb-3 block text-sm font-medium text-on-surface">
            Cantidades de interés
          </span>
          <div className="flex flex-wrap gap-3">
            {cantidades.map((cantidad) => (
              <label
                key={cantidad}
                className="flex items-center gap-2 border border-outline-variant bg-surface-container-low px-4 py-2 text-sm text-on-surface-variant transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary-container/20 has-[:checked]:text-on-surface"
              >
                <input type="checkbox" name="cantidades" value={cantidad} className="accent-primary" />
                {cantidad}
              </label>
            ))}
          </div>
        </div>
      )}

      {status === 'error' && <p className="text-sm text-error">{error}</p>}

      <Button type="submit" disabled={status === 'loading'} className="disabled:cursor-not-allowed disabled:opacity-60">
        {status === 'loading' ? 'Enviando…' : 'Solicitar Cotización'}
      </Button>
    </form>
  )
}
