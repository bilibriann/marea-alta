import Image from 'next/image'
import type { Certificacion } from '@/lib/home'
import { VerifiedIcon } from '@/components/icons'
import { Reveal } from '@/components/Reveal'

interface Props {
  certificaciones: Certificacion[]
}

export function CertificacionesSection({ certificaciones }: Props) {
  if (certificaciones.length === 0) return null

  const sellos = certificaciones.reduce<{ src: string; nombres: string[] }[]>((acc, cert) => {
    if (!cert.imagen) return acc
    const existing = acc.find((sello) => sello.src === cert.imagen)
    if (existing) {
      existing.nombres.push(cert.nombre)
    } else {
      acc.push({ src: cert.imagen, nombres: [cert.nombre] })
    }
    return acc
  }, [])

  return (
    <section className="border-t border-outline-variant/20 bg-white py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-12">
        <Reveal className="mb-16">
          <span className="mb-2 block font-mono text-label-sm font-bold uppercase tracking-widest text-tertiary">
            Respaldo Certificado
          </span>
          <h2 className="linea-decorativa text-headline-lg-mobile text-primary md:text-headline-xl">
            Certificaciones
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.2fr]">
          <Reveal
            variante="izquierda"
            className="tarjeta-interactiva flex h-full flex-wrap items-center justify-center gap-12 rounded-md border border-outline-variant bg-white px-10 py-10 sm:gap-16"
          >
            {sellos.map((sello) => (
              <Image
                key={sello.src}
                src={sello.src}
                alt={`Sello de certificación: ${sello.nombres.join(' y ')}`}
                width={860}
                height={739}
                className="h-36 w-auto"
              />
            ))}
          </Reveal>
          <div className="space-y-6">
            {certificaciones.map((cert, indice) => (
              <Reveal key={cert.nombre} variante="derecha" retraso={indice * 120}>
              <div className="item-interactivo -m-2 flex gap-4 rounded-xl p-2">
                <VerifiedIcon className="h-6 w-6 shrink-0 text-primary" />
                <div>
                  <h3 className="text-lg font-bold text-on-surface">{cert.nombre}</h3>
                  <p className="mt-1 text-sm text-on-surface-variant">{cert.descripcion}</p>
                  <p className="mt-2 font-mono text-xs uppercase tracking-widest text-on-surface-variant/70">
                    Organismo: {cert.organismo}
                  </p>
                </div>
              </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
