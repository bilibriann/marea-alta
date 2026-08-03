import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getAllServicios, getServicio } from '@/lib/servicios'

export const dynamicParams = false

export async function generateStaticParams() {
  const servicios = await getAllServicios()
  return servicios.map((s) => ({ servicio: s.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ servicio: string }>
}): Promise<Metadata> {
  const { servicio: slug } = await params
  const servicio = await getServicio(slug)
  if (!servicio) return {}
  return {
    title: servicio.titulo,
    description: servicio.resumen,
  }
}

export default async function ServicioPage({
  params,
}: {
  params: Promise<{ servicio: string }>
}) {
  const { servicio: slug } = await params
  const servicio = await getServicio(slug)
  if (!servicio) notFound()

  return (
    <div className="mx-auto max-w-4xl px-6 py-20">
      <h1 className="text-3xl font-bold text-gray-900">{servicio.titulo}</h1>
      <p className="mt-4 text-lg text-gray-600">{servicio.descripcion}</p>
      {servicio.beneficios.length > 0 && (
        <div className="mt-10">
          <h2 className="font-semibold text-gray-900">Beneficios</h2>
          <ul className="mt-4 space-y-2">
            {servicio.beneficios.map((b) => (
              <li key={b} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="mt-0.5 text-blue-900">✓</span>
                {b}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
