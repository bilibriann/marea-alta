import Link from 'next/link'
import type { Servicio } from '@/lib/servicios'

interface Props {
  servicios: Servicio[]
  /** Slug del servicio que se está viendo; se excluye del listado. */
  actual: string
}

/** Una sola línea de enlaces. El recorrido completo vive en el desplegable de la nav. */
export function OtrosServicios({ servicios, actual }: Props) {
  const otros = servicios.filter((s) => s.slug !== actual)
  if (otros.length === 0) return null

  return (
    <section className="border-t border-outline-variant/30 py-12">
      <div className="mx-auto max-w-7xl px-4 md:px-12">
        <h2 className="font-mono text-label-sm font-bold uppercase tracking-widest text-tertiary">
          Otros servicios
        </h2>
        <ul className="mt-5 flex flex-wrap gap-x-7 gap-y-3">
          {otros.map((servicio) => (
            <li key={servicio.slug}>
              <Link
                href={`/${servicio.slug}`}
                className="text-sm font-medium text-on-surface-variant underline-offset-4 transition-colors hover:text-primary hover:underline"
              >
                {servicio.titulo}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
