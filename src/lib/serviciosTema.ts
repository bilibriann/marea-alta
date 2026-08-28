/**
 * Cada servicio recibe una de las tres bandas del manual de marca
 * (Azul principal #045684, Celeste claro #d2e9f7, Verde claro #abc883).
 * Solo la primera es oscura: las otras dos llevan el texto en azul principal.
 * La Crema #f9efd4 nunca es banda: es el suelo de las secciones claras, así que
 * usarla como cabecera la dejaría a un paso del fondo de página.
 */
export type ClaveTema = 'azul' | 'azulProfundo' | 'verde'

export interface TemaServicio {
  /** Fondo de la banda de cabecera y del cierre. */
  banda: string
  /** Título sobre la banda. */
  titulo: string
  /** Texto secundario sobre la banda — teñido del propio tono, nunca gris. */
  cuerpo: string
  /** Hairlines sobre la banda y dentro del bloque de acento. */
  linea: string
  /** Acción primaria sobre la banda. */
  boton: string
  /** Bloque de acento sobre superficie clara (panel de cotización del riel). */
  bloque: string
  /** Botón dentro de ese bloque. */
  bloqueBoton: string
  /** Texto secundario dentro de ese bloque. */
  bloqueCuerpo: string
}

const TEMAS: Record<ClaveTema, TemaServicio> = {
  azul: {
    banda: 'bg-primary',
    titulo: 'text-white',
    cuerpo: 'text-white/75',
    linea: 'border-white/20',
    boton: 'bg-white text-primary hover:bg-brand-crema',
    bloque: 'bg-primary',
    bloqueBoton: 'bg-white text-primary hover:bg-brand-crema',
    bloqueCuerpo: 'text-white/75',
  },
  azulProfundo: {
    banda: 'bg-brand-azul-profundo',
    titulo: 'text-primary',
    cuerpo: 'text-on-surface-variant',
    linea: 'border-primary/20',
    boton: 'bg-primary text-white hover:bg-white hover:text-primary',
    bloque: 'bg-brand-azul-profundo',
    bloqueBoton: 'bg-primary text-white hover:bg-white hover:text-primary',
    bloqueCuerpo: 'text-on-surface-variant',
  },
  verde: {
    banda: 'bg-brand-verde',
    titulo: 'text-primary',
    cuerpo: 'text-on-surface-variant',
    linea: 'border-primary/25',
    boton: 'bg-primary text-white hover:bg-white hover:text-primary',
    bloque: 'bg-brand-verde',
    bloqueBoton: 'bg-primary text-white hover:bg-white hover:text-primary',
    bloqueCuerpo: 'text-on-surface-variant',
  },
}

const ASIGNACION: Record<string, ClaveTema> = {
  'control-de-calidad': 'azulProfundo',
  'laboratorio-de-innovacion': 'verde',
  'certificacion-de-procesos': 'azul',
  'monitoreo-de-temperatura': 'azulProfundo',
  'resistencia-al-aplastamiento': 'verde',
  trazabilidad: 'azul',
  'servicio-postventa': 'azulProfundo',
}

const ROTACION: ClaveTema[] = ['azulProfundo', 'verde', 'azul']

/** Un servicio nuevo creado desde el CMS entra en la rotación en vez de quedar sin tema. */
export function claveTema(slug: string, orden = 1): ClaveTema {
  return ASIGNACION[slug] ?? ROTACION[(Math.max(orden, 1) - 1) % ROTACION.length]
}

export function temaServicio(slug: string, orden = 1): TemaServicio {
  return TEMAS[claveTema(slug, orden)]
}
