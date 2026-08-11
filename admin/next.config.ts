import path from 'path'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Evita que Turbopack detecte el package-lock.json de ../ (el repo del
  // sitio público) y adopte esa carpeta como raíz del proyecto en vez de
  // esta — eso hacía que proxy.ts no se detectara correctamente.
  turbopack: {
    root: path.join(__dirname),
  },
  // Next.js no sirve index.html de un directorio automáticamente (a
  // diferencia de un host estático típico) — sin esto, /admin da 404 y solo
  // funciona la ruta exacta /admin/index.html.
  async rewrites() {
    return [{ source: '/admin', destination: '/admin/index.html' }]
  },
}

export default nextConfig
