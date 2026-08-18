'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { eliminarProductoAction } from '@/lib/actions/productos'

export default function BotonEliminarProducto({ id, nombre }: { id: number; nombre: string }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleClick() {
    if (!confirm(`¿Eliminar el producto "${nombre}"? Esta acción no se puede deshacer.`)) return
    setError(null)
    startTransition(async () => {
      try {
        await eliminarProductoAction(id)
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
