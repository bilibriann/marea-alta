import path from 'path'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Evita que Turbopack detecte el package-lock.json de ../ (el repo del
  // sitio público) y adopte esa carpeta como raíz del proyecto en vez de
  // esta — eso hacía que proxy.ts no se detectara correctamente.
  turbopack: {
    root: path.join(__dirname),
  },
  experimental: {
    serverActions: {
      // Default de Next.js es 1MB — muy poco para fotos de producto/noticia
      // reales (ver diagnóstico de subida de imágenes fallando en el panel).
      bodySizeLimit: '10mb',
    },
  },
}

export default nextConfig
