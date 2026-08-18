'use client'

import { useState, useTransition, type ChangeEvent, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { subirImagenAction } from '@/lib/actions/subida'
import { crearProductoAction, actualizarProductoAction } from '@/lib/actions/productos'
import type { ProductoInput } from '@/lib/productos'

interface Props {
  productoId?: number
  inicial?: ProductoInput
}

type Grupo = { tituloGrupo: string; opciones: string[] }

export default function ProductoForm({ productoId, inicial }: Props) {
  const router = useRouter()
  const [nombre, setNombre] = useState(inicial?.nombre ?? '')
  const [subtitulo, setSubtitulo] = useState(inicial?.subtitulo ?? '')
  const [notaAdicional, setNotaAdicional] = useState(inicial?.notaAdicional ?? '')
  const [videoYoutubeUrl, setVideoYoutubeUrl] = useState(inicial?.videoYoutubeUrl ?? '')
  const [estado, setEstado] = useState<'borrador' | 'publicado'>(inicial?.estado ?? 'borrador')
  const [cantidades, setCantidades] = useState<string[]>(inicial?.cantidadesParaCotizar ?? [])
  const [grupos, setGrupos] = useState<Grupo[]>(inicial?.gruposOpciones ?? [])
  const [imagenes, setImagenes] = useState<{ url: string }[]>(inicial?.imagenes ?? [])
  const [subiendo, setSubiendo] = useState(false)
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
      formData.append('carpeta', 'productos')
      const { url } = await subirImagenAction(formData)
      setImagenes((prev) => [...prev, { url }])
    } catch {
      setError('No se pudo subir la imagen. Intenta de nuevo.')
    } finally {
      setSubiendo(false)
    }
  }

  function moverImagen(index: number, direccion: -1 | 1) {
    setImagenes((prev) => {
      const destino = index + direccion
      if (destino < 0 || destino >= prev.length) return prev
      const copia = [...prev]
      ;[copia[index], copia[destino]] = [copia[destino], copia[index]]
      return copia
    })
  }

  function actualizarGrupo(index: number, cambios: Partial<Grupo>) {
    setGrupos((prev) => prev.map((g, i) => (i === index ? { ...g, ...cambios } : g)))
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    const input: ProductoInput = {
      nombre,
      subtitulo: subtitulo.trim() || undefined,
      notaAdicional: notaAdicional.trim() || undefined,
      videoYoutubeUrl: videoYoutubeUrl.trim() || undefined,
      estado,
      cantidadesParaCotizar: cantidades,
      gruposOpciones: grupos
        .map((g) => ({ tituloGrupo: g.tituloGrupo.trim(), opciones: g.opciones }))
        .filter((g) => g.tituloGrupo && g.opciones.length > 0),
      imagenes,
    }

    startTransition(async () => {
      try {
        if (productoId) {
          await actualizarProductoAction(productoId, input)
        } else {
          await crearProductoAction(input)
        }
        router.push('/productos')
        router.refresh()
      } catch {
        setError('No se pudo guardar el producto. Revisa los campos obligatorios.')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <p className="form-error">{error}</p>}

      <div className="form-campo">
        <label htmlFor="nombre">Nombre *</label>
        <input id="nombre" type="text" required value={nombre} onChange={(e) => setNombre(e.target.value)} />
      </div>

      <div className="form-campo">
        <label htmlFor="subtitulo">Subtítulo</label>
        <input
          id="subtitulo"
          type="text"
          value={subtitulo}
          onChange={(e) => setSubtitulo(e.target.value)}
          placeholder="Ej: Trilaminado, Caja Display 4 Unidades"
        />
      </div>

      <div className="form-campo">
        <label>Galería de imágenes</label>
        <div className="galeria">
          {imagenes.map((img, i) => (
            <div key={img.url} className="galeria-item">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt="" />
              <div className="galeria-item-acciones">
                <button type="button" onClick={() => moverImagen(i, -1)} disabled={i === 0}>
                  ↑
                </button>
                <button type="button" onClick={() => setImagenes((prev) => prev.filter((_, idx) => idx !== i))}>
                  Quitar
                </button>
                <button type="button" onClick={() => moverImagen(i, 1)} disabled={i === imagenes.length - 1}>
                  ↓
                </button>
              </div>
            </div>
          ))}
        </div>
        <input type="file" accept="image/*" onChange={handleSubidaImagen} disabled={subiendo} />
        {subiendo && <p className="form-hint">Subiendo imagen…</p>}
      </div>

      <div className="form-campo">
        <label>Grupos de opciones</label>
        <p className="form-hint">
          Deja vacío si el producto no tiene variantes. Cada grupo es una categoría libre (Formatos, Empaque, etc.)
          con sus propias opciones.
        </p>
        {grupos.map((grupo, i) => (
          <div key={i} className="grupo-anidado">
            <div className="grupo-anidado-header">
              <input
                type="text"
                value={grupo.tituloGrupo}
                onChange={(e) => actualizarGrupo(i, { tituloGrupo: e.target.value })}
                placeholder="Título del grupo (ej: Formatos)"
              />
              <button type="button" className="btn-peligro" onClick={() => setGrupos((p) => p.filter((_, idx) => idx !== i))}>
                Eliminar grupo
              </button>
            </div>
            <ListaTexto
              valores={grupo.opciones}
              onChange={(opciones) => actualizarGrupo(i, { opciones })}
              placeholder="Opción (ej: 150gr/15x19cm)"
            />
          </div>
        ))}
        <button
          type="button"
          className="btn-secundario"
          onClick={() => setGrupos((prev) => [...prev, { tituloGrupo: '', opciones: [] }])}
        >
          Agregar grupo
        </button>
      </div>

      <div className="form-campo">
        <label>Cantidades para cotizar</label>
        <ListaTexto valores={cantidades} onChange={setCantidades} placeholder="Ej: 50" />
      </div>

      <div className="form-campo">
        <label htmlFor="notaAdicional">Nota adicional</label>
        <textarea
          id="notaAdicional"
          rows={3}
          value={notaAdicional}
          onChange={(e) => setNotaAdicional(e.target.value)}
        />
      </div>

      <div className="form-campo">
        <label htmlFor="videoYoutubeUrl">Video de YouTube</label>
        <input
          id="videoYoutubeUrl"
          type="url"
          value={videoYoutubeUrl}
          onChange={(e) => setVideoYoutubeUrl(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
        />
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
        <button type="button" className="btn-secundario" onClick={() => router.push('/productos')}>
          Cancelar
        </button>
      </div>
    </form>
  )
}

function ListaTexto({
  valores,
  onChange,
  placeholder,
}: {
  valores: string[]
  onChange: (valores: string[]) => void
  placeholder?: string
}) {
  const [nuevo, setNuevo] = useState('')

  function agregar() {
    const v = nuevo.trim()
    if (!v) return
    onChange([...valores, v])
    setNuevo('')
  }

  return (
    <div>
      <div className="lista-inline">
        {valores.map((v, i) => (
          <span key={i} className="chip">
            {v}
            <button type="button" onClick={() => onChange(valores.filter((_, idx) => idx !== i))}>
              ×
            </button>
          </span>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          type="text"
          value={nuevo}
          placeholder={placeholder}
          onChange={(e) => setNuevo(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              agregar()
            }
          }}
        />
        <button type="button" className="btn-secundario" onClick={agregar}>
          Agregar
        </button>
      </div>
    </div>
  )
}
