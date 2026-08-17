import Link from 'next/link'
import type { Servicio } from '@/lib/servicios'
import type { TemaServicio } from '@/lib/serviciosTema'
import { siteConfig } from '@/config'
import { ArrowRightIcon, CallIcon, MailIcon, VerifiedIcon } from '@/components/icons'

interface Props {
  servicio: Servicio
  tema: TemaServicio
  /** slug -> nombre, para etiquetar los sectores sin acoplarse al orden del JSON. */
  nombresSector: Map<string, string>
}

const etiqueta =
  'font-mono text-label-sm font-bold uppercase tracking-widest text-on-surface-variant/70'

export function RielServicio({ servicio, tema, nombresSector }: Props) {
  const sectores = servicio.sectores
    .map((slug) => nombresSector.get(slug))
    .filter((nombre): nombre is string => Boolean(nombre))

  const tieneFicha = Boolean(servicio.alcance) || servicio.normas.length > 0 || sectores.length > 0

  return (
    /* El aside se estira a la altura de la fila del grid (no `self-start`): eso le da
       al panel de cotización recorrido para viajar. Pegar el riel completo no sirve —
       mide más que la ventana y el botón quedaría fuera de alcance. */
    <aside className="flex flex-col gap-6">
      {tieneFicha && (
        <div className="rounded-md border border-outline-variant/60 bg-white">
          <h2 className="border-b border-outline-variant/60 px-6 py-4 font-mono text-label-sm font-bold uppercase tracking-widest text-tertiary">
            Ficha del servicio
          </h2>
          <dl className="divide-y divide-outline-variant/40">
            {servicio.alcance && (
              <div className="px-6 py-5">
                <dt className={etiqueta}>Alcance</dt>
                <dd className="mt-2.5 text-sm leading-relaxed text-on-surface-variant">
                  {servicio.alcance}
                </dd>
              </div>
            )}
            {servicio.normas.length > 0 && (
              <div className="px-6 py-5">
                <dt className={etiqueta}>Referencia normativa</dt>
                <dd>
                  <ul className="mt-3 space-y-3">
                    {servicio.normas.map((norma) => (
                      <li
                        key={norma}
                        className="flex gap-2.5 text-sm leading-relaxed text-on-surface-variant"
                      >
                        <VerifiedIcon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        {norma}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            )}
            {sectores.length > 0 && (
              <div className="px-6 py-5">
                <dt className={etiqueta}>Sectores donde aplica</dt>
                <dd className="mt-3 flex flex-wrap gap-2">
                  {sectores.map((nombre) => (
                    <span
                      key={nombre}
                      className="rounded-md border border-outline-variant/70 bg-surface-container-high px-3 py-1.5 text-xs font-medium text-on-surface-variant"
                    >
                      {nombre}
                    </span>
                  ))}
                </dd>
              </div>
            )}
          </dl>
        </div>
      )}

      <div className={`rounded-md p-6 lg:sticky lg:top-28 ${tema.bloque}`}>
        <h2 className={`text-xl font-bold leading-snug ${tema.titulo}`}>
          ¿Necesita este servicio?
        </h2>
        <p className={`mt-3 text-sm leading-relaxed ${tema.bloqueCuerpo}`}>
          Cuéntenos el rango de temperatura, el volumen y el tiempo de tránsito que debe cubrir.
          Con eso le respondemos con una propuesta concreta.
        </p>
        <Link
          href="/contacto"
          className={`mt-6 flex w-full items-center justify-center gap-2 rounded-md px-6 py-3.5 font-bold transition-all active:scale-95 ${tema.bloqueBoton}`}
        >
          Solicitar cotización
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
        <div className={`mt-6 space-y-3 border-t pt-6 ${tema.linea}`}>
          <a
            href={`tel:${siteConfig.contacto.telefono.replace(/\s/g, '')}`}
            className={`flex items-center gap-3 text-sm font-semibold transition-opacity hover:opacity-75 ${tema.titulo}`}
          >
            <CallIcon className="h-4 w-4 shrink-0" />
            {siteConfig.contacto.telefono}
          </a>
          <a
            href={`mailto:${siteConfig.contacto.email}`}
            className={`flex items-center gap-3 break-all text-sm font-semibold transition-opacity hover:opacity-75 ${tema.titulo}`}
          >
            <MailIcon className="h-4 w-4 shrink-0" />
            {siteConfig.contacto.email}
          </a>
          <p className={`pt-1 font-mono text-label-xs uppercase ${tema.bloqueCuerpo}`}>
            {siteConfig.contacto.horario}
          </p>
        </div>
      </div>
    </aside>
  )
}
