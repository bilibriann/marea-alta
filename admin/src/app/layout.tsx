import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Panel de Administración — Marea Alta',
  robots: { index: false, follow: false },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
