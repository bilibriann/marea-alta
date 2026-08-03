import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllServicios } from '@/lib/servicios'

export const metadata: Metadata = {
  title: 'Servicios',
  description: 'Servicios de control de calidad y cadena de frío de Marea Alta Chile.',
}

export default async function ServiciosPage() {
  const servicios = await getAllServicios()

  return (
    <div className="mx-auto max-w-5xl px-6 py-20">
      <h1 className="text-3xl font-bold text-gray-900">Servicios</h1>
      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {servicios.map((s) => (
          <Link
            key={s.slug}
            href={`/${s.slug}`}
            className="rounded-lg border border-gray-200 p-6 hover:border-blue-900 hover:shadow-sm"
          >
            <h2 className="font-semibold text-gray-900">{s.titulo}</h2>
            <p className="mt-2 text-sm text-gray-600">{s.resumen}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
