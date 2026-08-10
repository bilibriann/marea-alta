'use client'

import { useState } from 'react'

interface Props {
  parrafos: string[]
  parrafoClassName?: string
}

export function ExpandableText({ parrafos, parrafoClassName = '' }: Props) {
  const [abierto, setAbierto] = useState(false)
  const [primero, ...resto] = parrafos

  return (
    <div className="space-y-4">
      <p className={parrafoClassName}>{primero}</p>
      {resto.length > 0 && (
        <>
          <div
            className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
              abierto ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
            }`}
          >
            <div className="space-y-4 overflow-hidden">
              {resto.map((parrafo) => (
                <p key={parrafo} className={parrafoClassName}>
                  {parrafo}
                </p>
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setAbierto((valor) => !valor)}
            aria-expanded={abierto}
            className="text-sm font-bold text-primary hover:text-primary-container"
          >
            {abierto ? 'Ver menos' : 'Ver más'}
          </button>
        </>
      )}
    </div>
  )
}
