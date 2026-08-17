import type { MetadataRoute } from 'next'
import { siteConfig } from '@/config'
import { getAllServicios } from '@/lib/servicios'

export const dynamic = 'force-static'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const servicios = await getAllServicios()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteConfig.url, priority: 1, changeFrequency: 'monthly' },
    { url: `${siteConfig.url}/productos`, priority: 0.8, changeFrequency: 'monthly' },
    { url: `${siteConfig.url}/contacto`, priority: 0.7, changeFrequency: 'yearly' },
  ]

  const servicioRoutes: MetadataRoute.Sitemap = servicios.map((s) => ({
    url: `${siteConfig.url}/${s.slug}`,
    priority: 0.8,
    changeFrequency: 'monthly' as const,
  }))

  return [...staticRoutes, ...servicioRoutes]
}
