import type { Metadata } from 'next'
import { siteConfig } from '@/config'

export const metadata: Metadata = {
  title: 'Contacto',
  description: 'Contáctenos para consultas sobre nuestros productos y servicios.',
}

export default function ContactoPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-20">
      <h1 className="text-3xl font-bold text-gray-900">Contacto</h1>
      <div className="mt-10 grid gap-10 sm:grid-cols-2">
        <div>
          <h2 className="font-semibold text-gray-900">Datos de contacto</h2>
          <dl className="mt-4 space-y-3 text-sm text-gray-600">
            <div>
              <dt className="font-medium text-gray-900">Email</dt>
              <dd>{siteConfig.contacto.email}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-900">Teléfono</dt>
              <dd>{siteConfig.contacto.telefono}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-900">Dirección</dt>
              <dd>{siteConfig.contacto.direccion}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-900">Horario</dt>
              <dd>{siteConfig.contacto.horario}</dd>
            </div>
          </dl>
        </div>
        <form className="space-y-4">
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-900">
              Nombre
            </label>
            <input
              id="nombre"
              name="nombre"
              type="text"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-900">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label htmlFor="mensaje" className="block text-sm font-medium text-gray-900">
              Mensaje
            </label>
            <textarea
              id="mensaje"
              name="mensaje"
              rows={4}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <button
            type="submit"
            className="rounded-md bg-blue-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800"
          >
            Enviar mensaje
          </button>
        </form>
      </div>
    </div>
  )
}
