import type { MetadataRoute } from 'next'
import { siteConfig } from '@/config'
import { getAllServicios } from '@/lib/servicios'
import { getAllNoticias } from '@/lib/noticias'

export const dynamic = 'force-static'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [servicios, noticias] = await Promise.all([getAllServicios(), getAllNoticias()])

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteConfig.url, priority: 1, changeFrequency: 'monthly' },
    { url: `${siteConfig.url}/productos`, priority: 0.8, changeFrequency: 'monthly' },
    { url: `${siteConfig.url}/contacto`, priority: 0.7, changeFrequency: 'yearly' },
    { url: `${siteConfig.url}/noticias`, priority: 0.6, changeFrequency: 'weekly' },
  ]

  const servicioRoutes: MetadataRoute.Sitemap = servicios.map((s) => ({
    url: `${siteConfig.url}/${s.slug}`,
    priority: 0.8,
    changeFrequency: 'monthly' as const,
  }))

  const noticiaRoutes: MetadataRoute.Sitemap = noticias.map((n) => ({
    url: `${siteConfig.url}/noticias/${n.slug}`,
    lastModified: n.fecha,
    priority: 0.6,
    changeFrequency: 'yearly' as const,
  }))

  return [...staticRoutes, ...servicioRoutes, ...noticiaRoutes]
}
