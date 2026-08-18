import { notFound } from 'next/navigation'
import { obtenerNoticia } from '@/lib/noticias'
import NoticiaForm from '../NoticiaForm'

export default async function EditarNoticiaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const noticia = await obtenerNoticia(Number(id))
  if (!noticia) notFound()

  return (
    <div>
      <h1>Editar noticia</h1>
      <NoticiaForm
        noticiaId={noticia.id}
        inicial={{
          titulo: noticia.titulo,
          imagenDestacadaUrl: noticia.imagenDestacadaUrl,
          fecha: noticia.fecha,
          extracto: noticia.extracto,
          contenido: noticia.contenido,
          estado: noticia.estado,
        }}
      />
    </div>
  )
}
