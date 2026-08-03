import type { SiteConfig } from '@/types'

export const siteConfig: SiteConfig = {
  name: 'Marea Alta Chile SpA',
  description:
    'Fabricantes de soluciones de cadena de frío y control de calidad para las industrias farmacéutica, alimentaria y logística en Chile.',
  url: 'https://mareaalta-latam.com',
  nav: [
    { label: 'Inicio', href: '/' },
    { label: 'Servicios', href: '/servicios' },
    { label: 'Productos', href: '/productos' },
    { label: 'Contacto', href: '/contacto' },
  ],
  contacto: {
    email: 'ventas@mareaalta-latam.com',
    telefono: '+56 9 4041 7967',
    direccion: 'Avda. Lo Espejo Nº02124, Bodegas 6-7, San Bernardo, RM',
    horario: 'Lun–Vie, 9:00–18:00',
  },
  redes: {
    instagram: 'https://instagram.com/mareaaltachile',
    linkedin: 'https://linkedin.com/company/mareaalta',
    facebook: 'https://facebook.com/mareaaltachile',
  },
}
