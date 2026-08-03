import type { Metadata } from 'next'
import { getProductosContent } from '@/lib/productos'

export const metadata: Metadata = {
  title: 'Productos',
  description: 'Soluciones de embalaje térmico de alta precisión fabricadas por Marea Alta Chile.',
}

export default async function ProductosPage() {
  const productos = await getProductosContent()

  return (
    <div className="mx-auto max-w-5xl px-6 py-20">
      <h1 className="text-3xl font-bold text-gray-900">{productos.titulo}</h1>
      <p className="mt-4 text-lg text-gray-600">{productos.descripcion}</p>
    </div>
  )
}
