export interface NavItem {
  label: string
  href: string
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
