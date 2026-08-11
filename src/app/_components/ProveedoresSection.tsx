import Image from 'next/image'
import type { Proveedor } from '@/lib/home'

interface Props {
  proveedores: Proveedor[]
}

export function ProveedoresSection({ proveedores }: Props) {
  if (proveedores.length === 0) return null

  return (
    <section className="border-t border-white/10 bg-primary py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-12">
        <div className="mb-16 text-center">
          <span className="mb-2 block font-mono text-label-sm font-bold uppercase tracking-widest text-accent">
            Alianzas Estratégicas
          </span>
          <h2 className="text-headline-lg-mobile text-white md:text-headline-xl">
            Productos de Confianza
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-6">
          {proveedores.map((proveedor) => (
            <div
              key={proveedor.nombre}
              className="flex h-28 items-center justify-center rounded-md border border-outline-variant bg-white p-6"
            >
              <Image
                src={proveedor.logo}
                alt={proveedor.nombre}
                width={240}
                height={96}
                className="h-auto max-h-14 w-auto max-w-full object-contain grayscale transition-all duration-300 hover:grayscale-0"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
