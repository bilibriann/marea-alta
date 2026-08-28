import Link from 'next/link'
import type { Servicio } from '@/lib/servicios'

interface Props {
  servicios: Servicio[]
  /** Slug del servicio que se está viendo; se excluye del listado. */
  actual: string
}

/** Fila compacta de enlaces. El recorrido completo vive en el desplegable de la nav. */
export function OtrosServicios({ servicios, actual }: Props) {
  const otros = servicios.filter((s) => s.slug !== actual)
  if (otros.length === 0) return null

  return (
    <section className="border-t border-outline-variant/30 py-4">
      <div className="mx-auto max-w-7xl px-4 md:px-12">
        <h2 className="font-mono text-label-sm font-bold uppercase tracking-widest text-outline">
          Otros servicios
        </h2>
        {/* Sin scroll en ningún eje: los enlaces envuelven. El divisor va en todos
            los ítems, incluido el primero de cada fila, y el desfase de -1px contra
            el `overflow-hidden` del contenedor recorta esa barra sobrante en el
            borde izquierdo. Con `first:border-l-0` solo se corregiría la primera
            fila y las siguientes quedarían con el divisor colgando. */}
        <div className="-ml-4 mt-3 overflow-hidden">
          <ul className="-ml-px flex flex-wrap gap-y-2">
            {otros.map((servicio) => (
              <li key={servicio.slug} className="border-l border-outline-variant px-4">
                <Link
                  href={`/${servicio.slug}`}
                  className="block whitespace-nowrap text-label-sm font-semibold uppercase text-on-surface-variant transition-colors duration-200 hover:text-primary focus-visible:text-primary"
                >
                  {servicio.titulo}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
