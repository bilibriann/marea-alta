'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { eliminarNoticiaAction } from '@/lib/actions/noticias'

export default function BotonEliminarNoticia({ id, titulo }: { id: number; titulo: string }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleClick() {
    if (!confirm(`¿Eliminar la noticia "${titulo}"? Esta acción no se puede deshacer.`)) return
    setError(null)
    startTransition(async () => {
      try {
        await eliminarNoticiaAction(id)
        router.refresh()
      } catch {
        setError('No se pudo eliminar.')
      }
    })
  }

  return (
    <>
      <button type="button" className="btn-peligro" onClick={handleClick} disabled={pending}>
        {pending ? 'Eliminando…' : 'Eliminar'}
      </button>
      {error && <span className="form-error">{error}</span>}
    </>
  )
}
