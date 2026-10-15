import type { ReactNode, SVGProps } from 'react'

/*
 * Motivo técnico de cada servicio: un icono de línea grande que se dibuja solo
 * al cargar (ver `.icono-servicio` en globals.css). Cada trazo lleva
 * `pathLength={1}` para que la animación del dash no dependa de su largo real.
 * La grilla es de 64×64 y el trazo de 1.25: a ~220px queda tan fino como los
 * hairlines de la banda.
 */
const P = (props: SVGProps<SVGPathElement>) => <path pathLength={1} {...props} />
const C = (props: SVGProps<SVGCircleElement>) => <circle pathLength={1} {...props} />
const R = (props: SVGProps<SVGRectElement>) => <rect pathLength={1} {...props} />

const MOTIVOS: Record<string, ReactNode> = {
  // Planilla de inspección con visto bueno y lupa.
  'control-de-calidad': (
    <>
      <R x="12" y="12" width="32" height="44" rx="3" />
      <R x="21" y="8" width="14" height="8" rx="2" />
      <P d="M19 26h18M19 33h12" />
      <P d="M19 44l4 4 8-8" />
      <C cx="46" cy="44" r="8" />
      <P d="M51.7 49.7 58 56" />
    </>
  ),
  // Matraz con burbujas y un destello de idea.
  'laboratorio-de-innovacion': (
    <>
      <P d="M25 8h14" />
      <P d="M28 8v16L14.5 49.5A4 4 0 0 0 18 55.5h28a4 4 0 0 0 3.5-6L36 24V8" />
      <P d="M19.5 41h25" />
      <C cx="28" cy="48" r="2" />
      <C cx="37" cy="46" r="1.5" />
      <P d="M50 10v8M46 14h8" />
    </>
  ),
  // Sello de certificación con cintas.
  'certificacion-de-procesos': (
    <>
      <C cx="32" cy="26" r="16" />
      <C cx="32" cy="26" r="11" />
      <P d="M27 26l3.5 3.5L38 22" />
      <P d="M23 38.5 17 56l7-3 4 6 4-12.5" />
      <P d="M41 38.5 47 56l-7-3-4 6-4-12.5" />
    </>
  ),
  // Termómetro con escala y la curva registrada.
  'monitoreo-de-temperatura': (
    <>
      <P d="M18 40V12a6 6 0 0 1 12 0v28a10 10 0 1 1-12 0Z" />
      <P d="M24 22v22" />
      <C cx="24" cy="48" r="4" />
      <P d="M35 14h5M35 21h5M35 28h5" />
      <P d="M36 50l6-8 5 5 11-16" />
    </>
  ),
  // Caja bajo una prensa: la carga que debe resistir.
  'resistencia-al-aplastamiento': (
    <>
      <P d="M32 4v8" />
      <P d="M12 12h40" />
      <P d="M22 16v8M18.5 20.5 22 24l3.5-3.5" />
      <P d="M42 16v8M38.5 20.5 42 24l3.5-3.5" />
      <P d="M14 36l18-8 18 8v16l-18 8-18-8Z" />
      <P d="M14 36l18 8 18-8M32 44v16" />
    </>
  ),
  // Recorrido de un despacho hasta su destino, con código de barras.
  trazabilidad: (
    <>
      <C cx="12" cy="50" r="3" />
      <P d="M15 50h10a7 7 0 0 0 7-7v-8a7 7 0 0 1 7-7h9" />
      <P d="M48 6a8 8 0 0 0-8 8c0 6 8 14 8 14s8-8 8-14a8 8 0 0 0-8-8Z" />
      <C cx="48" cy="14" r="2.5" />
      <P d="M40 42v14M44 42v14M47 42v14M52 42v14M55 42v14" />
    </>
  ),
  // Audífono de atención al cliente.
  'servicio-postventa': (
    <>
      <P d="M14 38v-6a18 18 0 0 1 36 0v6" />
      <R x="9" y="36" width="9" height="15" rx="3" />
      <R x="46" y="36" width="9" height="15" rx="3" />
      <P d="M50.5 51v1a8 8 0 0 1-8 8H38" />
      <R x="31" y="57" width="7" height="6" rx="2" />
    </>
  ),
}

// Un servicio nuevo creado desde el CMS recibe una caja térmica genérica.
const MOTIVO_GENERICO: ReactNode = (
  <>
    <P d="M10 24h44v30H10Z" />
    <P d="M10 24l6-10h32l6 10" />
    <P d="M25 36h14" />
    <P d="M32 8v6" />
  </>
)

export function IconoServicio({ slug, className = '' }: { slug: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`icono-servicio ${className}`}
    >
      {MOTIVOS[slug] ?? MOTIVO_GENERICO}
    </svg>
  )
}
