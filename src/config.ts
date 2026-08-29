import type { SiteConfig } from '@/types'

/**
 * Destino único de todo el correo que sale del sitio: formulario de contacto,
 * newsletter y las cotizaciones por producto. El dominio definitivo todavía no
 * está confirmado, así que se sobreescribe por entorno
 * (NEXT_PUBLIC_CONTACT_EMAIL) sin tocar código. No repitas esta dirección en
 * ningún otro archivo: importa esta constante.
 */
export const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? 'ventas@mareaalta-latam.com'

export const siteConfig: SiteConfig = {
  name: 'Marea Alta Chile SpA',
  description:
    'Fabricantes de soluciones de cadena de frío y control de calidad para las industrias farmacéutica, alimentaria y logística en Chile.',
  url: 'https://mareaalta-latam.com',
  nav: [
    { label: 'Inicio', href: '/' },
    // No hay página índice de servicios: este item es el desplegable que el Header
    // arma a partir de src/content/servicios.
    { label: 'Servicios', href: '#', menu: 'servicios' },
    { label: 'Productos', href: '/productos' },
    { label: 'Contacto', href: '/contacto' },
    // Noticias oculto temporalmente: la sección se retomará más adelante.
    // { label: 'Noticias', href: '/noticias' },
  ],
  contacto: {
    email: CONTACT_EMAIL,
    telefono: '+56 9 4041 7967',
    direccion: 'José Joaquín Prieto 9001, Bodegas 11-12, Galpón 2, Lo Espejo, RM',
    horario: 'Lun–Vie, 9:00–18:00',
  },
  redes: {
    instagram: 'https://instagram.com/mareaaltachile',
    linkedin: 'https://linkedin.com/company/mareaalta',
    facebook: 'https://facebook.com/mareaaltachile',
  },
}
