'use client'

import { useState, useTransition, type ChangeEvent, type SubmitEvent } from 'react'
import { useRouter } from 'next/navigation'
import { subirImagenAction } from '@/lib/actions/subida'
import { crearNoticiaAction, actualizarNoticiaAction } from '@/lib/actions/noticias'
import type { NoticiaInput } from '@/lib/noticias'

interface Props {
  noticiaId?: number
  inicial?: {
    titulo: string
    imagenDestacadaUrl: string | null
    fecha: Date
    extracto: string
    contenido: string
    estado: 'borrador' | 'publicado'
  }
}

function aFechaInput(fecha?: Date): string {
  if (!fecha) return ''
  return fecha.toISOString().slice(0, 10)
}

export default function NoticiaForm({ noticiaId, inicial }: Props) {
  const router = useRouter()
  const [titulo, setTitulo] = useState(inicial?.titulo ?? '')
  const [imagenDestacadaUrl, setImagenDestacadaUrl] = useState<string | null>(
    inicial?.imagenDestacadaUrl ?? null
  )
  const [fecha, setFecha] = useState(aFechaInput(inicial?.fecha) || aFechaInput(new Date()))
  const [extracto, setExtracto] = useState(inicial?.extracto ?? '')
  const [contenido, setContenido] = useState(inicial?.contenido ?? '')
  const [estado, setEstado] = useState<'borrador' | 'publicado'>(inicial?.estado ?? 'borrador')
  const [subiendo, setSubiendo] = useState(false)
  const [subiendoInline, setSubiendoInline] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  async function handleSubidaImagen(e: ChangeEvent<HTMLInputElement>) {
    const archivo = e.target.files?.[0]
    e.target.value = ''
    if (!archivo) return

    setSubiendo(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append('archivo', archivo)
      formData.append('carpeta', 'noticias')
      const { url } = await subirImagenAction(formData)
      setImagenDestacadaUrl(url)
    } catch {
      setError('No se pudo subir la imagen. Intenta de nuevo.')
    } finally {
      setSubiendo(false)
    }
  }

  async function handleSubidaImagenInline(e: ChangeEvent<HTMLInputElement>) {
    const archivo = e.target.files?.[0]
    e.target.value = ''
    if (!archivo) return

    setSubiendoInline(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append('archivo', archivo)
      formData.append('carpeta', 'noticias')
      const { url } = await subirImagenAction(formData)
      setContenido((prev) => `${prev}${prev ? '\n\n' : ''}![](${url})\n\n`)
    } catch {
      setError('No se pudo subir la imagen. Intenta de nuevo.')
    } finally {
      setSubiendoInline(false)
    }
  }

  function handleSubmit(e: SubmitEvent) {
    e.preventDefault()
    setError(null)

    const input: NoticiaInput = {
      titulo,
      imagenDestacadaUrl: imagenDestacadaUrl ?? undefined,
      fecha: new Date(fecha),
      extracto,
      contenido,
      estado,
    }

    startTransition(async () => {
      try {
        if (noticiaId) {
          await actualizarNoticiaAction(noticiaId, input)
        } else {
          await crearNoticiaAction(input)
        }
        router.push('/noticias')
        router.refresh()
      } catch {
        setError('No se pudo guardar la noticia. Revisa los campos obligatorios.')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <p className="form-error">{error}</p>}

      <div className="form-campo">
        <label htmlFor="titulo">Título *</label>
        <input id="titulo" type="text" required value={titulo} onChange={(e) => setTitulo(e.target.value)} />
      </div>

      <div className="form-campo">
        <label>Imagen destacada</label>
        <p className="form-hint">Opcional — se puede publicar una noticia sin imagen.</p>
        {imagenDestacadaUrl && (
          <div className="imagen-destacada-preview">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imagenDestacadaUrl} alt="" />
            <button type="button" className="btn-secundario" onClick={() => setImagenDestacadaUrl(null)}>
              Quitar imagen
            </button>
          </div>
        )}
        <input type="file" accept="image/*" onChange={handleSubidaImagen} disabled={subiendo} />
        {subiendo && <p className="form-hint">Subiendo imagen…</p>}
      </div>

      <div className="form-campo">
        <label htmlFor="fecha">Fecha *</label>
        <input id="fecha" type="date" required value={fecha} onChange={(e) => setFecha(e.target.value)} />
      </div>

      <div className="form-campo">
        <label htmlFor="extracto">Extracto *</label>
        <textarea
          id="extracto"
          rows={2}
          required
          value={extracto}
          onChange={(e) => setExtracto(e.target.value)}
          placeholder="Resumen corto para el listado de noticias"
        />
      </div>

      <div className="form-campo">
        <label htmlFor="contenido">Contenido *</label>
        <p className="form-hint">
          Soporta markdown: subtítulos (##) y párrafos. Para intercalar una imagen, súbela abajo — se agrega al
          final del contenido y puedes mover esa línea a donde corresponda.
        </p>
        <textarea
          id="contenido"
          rows={14}
          required
          value={contenido}
          onChange={(e) => setContenido(e.target.value)}
        />
        <input type="file" accept="image/*" onChange={handleSubidaImagenInline} disabled={subiendoInline} />
        {subiendoInline && <p className="form-hint">Subiendo imagen…</p>}
      </div>

      <div className="form-campo">
        <label htmlFor="estado">Estado</label>
        <select id="estado" value={estado} onChange={(e) => setEstado(e.target.value as 'borrador' | 'publicado')}>
          <option value="borrador">Borrador</option>
          <option value="publicado">Publicado</option>
        </select>
      </div>

      <div className="form-acciones">
        <button type="submit" className="btn-primario" disabled={pending || subiendo}>
          {pending ? 'Guardando…' : 'Guardar'}
        </button>
        <button type="button" className="btn-secundario" onClick={() => router.push('/noticias')}>
          Cancelar
        </button>
      </div>
    </form>
  )
}
