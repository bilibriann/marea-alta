import Image from 'next/image'
import type { Certificacion, Testimonio } from '@/lib/home'
import { VerifiedIcon } from '@/components/icons'

interface Props {
  certificaciones: Certificacion[]
  testimonios: Testimonio[]
}

export function EvidenciaSection({ certificaciones, testimonios }: Props) {
  if (certificaciones.length === 0 && testimonios.length === 0) return null

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
    <section className="bg-inverse-surface py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-12">
        <div className="mb-16">
          <span className="mb-2 block font-mono text-label-sm font-bold uppercase tracking-widest text-tertiary">
            Respaldo Certificado
          </span>
          <h2 className="text-headline-lg-mobile text-white md:text-headline-xl">
            Confianza Verificable
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.2fr]">
          {certificaciones.length > 0 && (
            <div className="space-y-8">
              {sellos.map((sello) => (
                <div key={sello.src} className="border border-white/10 bg-white p-8">
                  <Image
                    src={sello.src}
                    alt={`Sellos de certificación: ${sello.nombres.join(' y ')}`}
                    width={860}
                    height={739}
                    className="mx-auto h-auto w-full max-w-xs"
                  />
                </div>
              ))}
              <div className="space-y-6">
                {certificaciones.map((cert) => (
                  <div key={cert.nombre} className="flex gap-4">
                    <VerifiedIcon className="h-6 w-6 shrink-0 text-tertiary" />
                    <div>
                      <h3 className="text-lg font-bold text-white">{cert.nombre}</h3>
                      <p className="mt-1 text-sm text-white/70">{cert.descripcion}</p>
                      <p className="mt-2 font-mono text-xs uppercase tracking-widest text-white/40">
                        Organismo: {cert.organismo}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {testimonios.length > 0 && (
            <div className="space-y-6">
              {testimonios.map((testimonio) => (
                <blockquote
                  key={testimonio.nombre}
                  className="border border-white/10 bg-white/5 p-10"
                >
                  <p className="text-xl leading-relaxed text-white">
                    &ldquo;{testimonio.testimonio}&rdquo;
                  </p>
                  <footer className="mt-6 font-mono text-xs uppercase tracking-widest text-tertiary">
                    {testimonio.nombre} — {testimonio.cargo}, {testimonio.empresa}
                  </footer>
                </blockquote>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
