import { notFound } from 'next/navigation'
import { obtenerProducto } from '@/lib/productos'
import ProductoForm from '../ProductoForm'

export default async function EditarProductoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const producto = await obtenerProducto(Number(id))
  if (!producto) notFound()

  return (
    <div>
      <h1>Editar producto</h1>
      <ProductoForm
        productoId={producto.id}
        inicial={{
          nombre: producto.nombre,
          subtitulo: producto.subtitulo ?? undefined,
          notaAdicional: producto.notaAdicional ?? undefined,
          videoYoutubeUrl: producto.videoYoutubeUrl ?? undefined,
          estado: producto.estado,
          cantidadesParaCotizar: producto.cantidadesParaCotizar as string[],
          gruposOpciones: producto.gruposOpciones.map((g) => ({
            tituloGrupo: g.tituloGrupo,
            opciones: g.opciones as string[],
          })),
          imagenes: producto.imagenes.map((i) => ({ url: i.url })),
        }}
      />
    </div>
  )
}
