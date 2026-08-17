export interface NavItem {
  label: string
  href: string
  /**
   * Marca el item como desplegable en vez de enlace. El Header lo reemplaza por
   * el menú de servicios; el Footer lo omite, porque no hay página que enlazar.
   */
  menu?: 'servicios'
}

export interface SiteConfig {
  name: string
  description: string
  url: string
  nav: NavItem[]
  contacto: {
    email: string
    telefono: string
    direccion: string
    horario: string
  }
  redes: {
    facebook?: string
    instagram?: string
    linkedin?: string
  }
}
