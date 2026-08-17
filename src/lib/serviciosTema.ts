/**
 * Cada servicio recibe una de las tres bandas saturadas del manual de marca
 * (Azul principal #045684, Azul profundo #083645, Verde claro #abc883).
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
    titulo: 'text-white',
    cuerpo: 'text-white/75',
    linea: 'border-white/20',
    boton: 'bg-white text-brand-azul-profundo hover:bg-brand-verde',
    bloque: 'bg-brand-azul-profundo',
    bloqueBoton: 'bg-brand-verde text-brand-azul-profundo hover:bg-white',
    bloqueCuerpo: 'text-white/75',
  },
  verde: {
    banda: 'bg-brand-verde',
    titulo: 'text-brand-azul-profundo',
    cuerpo: 'text-brand-azul-profundo/80',
    linea: 'border-brand-azul-profundo/25',
    boton: 'bg-brand-azul-profundo text-white hover:bg-white hover:text-brand-azul-profundo',
    bloque: 'bg-brand-verde',
    bloqueBoton: 'bg-brand-azul-profundo text-white hover:bg-white hover:text-brand-azul-profundo',
    bloqueCuerpo: 'text-brand-azul-profundo/80',
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
