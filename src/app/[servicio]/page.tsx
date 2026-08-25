import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import { getAllServicios, getServicio } from '@/lib/servicios'
import { getCertificaciones, getSectores, getTestimonios } from '@/lib/home'
import { temaServicio } from '@/lib/serviciosTema'
import { VerifiedIcon } from '@/components/icons'
import { Reveal } from '@/components/Reveal'
import { BandaServicio } from './_components/BandaServicio'
import { RielServicio } from './_components/RielServicio'
import { OtrosServicios } from './_components/OtrosServicios'

export const dynamicParams = false

const CONTRATO = `<!--
THESIS: La página de un servicio es su ficha de ensayo, no un folleto ni un artículo:
todo se escanea de una pasada. Rechaza el hero de foto genérica, la grilla de tarjetas
icono+titulo+texto y cualquier bloque de lectura larga.
OWN-WORLD: Paleta del manual — Azul #045684, Azul profundo #083645, Verde claro #abc883,
Crema #f9efd4 sobre #fefdf9. Bandas planas a sangre, hairlines de 1px, radio 6px, cero
sombra. Poppins en prosa, JetBrains Mono en mayúsculas para todo dato. Un dibujo técnico
autoral por servicio.
STORY: El comprador técnico entiende el alcance en un párrafo, escanea las etapas y las
normas que lo respaldan, y pide cotización sin perder de vista el riel lateral.
FIRST VIEWPORT: Banda a sangre en el color del servicio; a la izquierda índice mono, H1 y
resumen sobre dos acciones; a la derecha panel cuadrado con el motivo técnico dibujándose.
Bajo la banda, franja de cuatro datos verificables.
FORM: Columna editorial + riel técnico persistente; candidato 5 de la lista ordenada;
seed 8603f432.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review,
the verdict, and DESIGN.md
-->`

export async function generateStaticParams() {
  const servicios = await getAllServicios()
  return servicios.map((s) => ({ servicio: s.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ servicio: string }>
}): Promise<Metadata> {
  const { servicio: slug } = await params
  const servicio = await getServicio(slug)
  if (!servicio) return {}
  return {
    title: servicio.titulo,
    description: servicio.resumen,
  }
}

export default async function ServicioPage({
  params,
}: {
  params: Promise<{ servicio: string }>
}) {
  const { servicio: slug } = await params
  const [servicio, servicios, sectores, certificaciones, testimonios] = await Promise.all([
    getServicio(slug),
    getAllServicios(),
    getSectores(),
    getCertificaciones(),
    getTestimonios(),
  ])
  if (!servicio) notFound()

  const tema = temaServicio(servicio.slug, servicio.orden)
  const nombresSector = new Map(sectores.map((s) => [s.slug, s.nombre]))
  const testimonio = testimonios[0]

  return (
    <>
      <div hidden dangerouslySetInnerHTML={{ __html: CONTRATO }} />

      <BandaServicio servicio={servicio} tema={tema} />

      <div className="mx-auto max-w-7xl px-4 md:px-12">
        <div className="grid gap-12 py-14 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-16 lg:py-16">
          <Reveal as="article" variante="izquierda" className="min-w-0">
            <h2 className="font-mono text-label-sm font-bold uppercase tracking-widest text-tertiary">
              En qué consiste
            </h2>
            <p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-on-surface-variant md:text-xl">
              {servicio.descripcion}
            </p>

            {testimonio && (
              <figure className="mt-12 border-t border-outline-variant/50 pt-8">
                <blockquote className="max-w-[52ch] text-lg leading-relaxed text-on-surface">
                  &ldquo;{testimonio.testimonio}&rdquo;
                </blockquote>
                <figcaption className="mt-4 font-mono text-label-xs uppercase text-tertiary">
                  {testimonio.nombre} — {testimonio.cargo}, {testimonio.empresa}
                </figcaption>
              </figure>
            )}
          </Reveal>

          <Reveal variante="derecha" retraso={120}>
            <RielServicio servicio={servicio} tema={tema} nombresSector={nombresSector} />
          </Reveal>
        </div>
      </div>

      {certificaciones.length > 0 && (
        <section className="border-y border-primary/15 bg-brand-azul-profundo py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-4 md:px-12">
            <Reveal>
              <span className="mb-2 block font-mono text-label-sm font-bold uppercase tracking-widest text-primary">
                Respaldo verificable
              </span>
              <h2 className="linea-decorativa text-headline-lg-mobile text-primary md:text-headline-xl">
                Certificaciones vigentes
              </h2>
            </Reveal>
            <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[auto_1fr] lg:gap-16">
              <Reveal
                variante="izquierda"
                className="flex flex-wrap items-center gap-8 self-start rounded-md bg-white px-8 py-8"
              >
                {certificaciones
                  .filter((cert) => cert.imagen)
                  .map((cert) => (
                    <Image
                      key={cert.imagen}
                      src={cert.imagen}
                      alt={`Sello de certificación ${cert.nombre}`}
                      width={860}
                      height={739}
                      className="h-24 w-auto"
                    />
                  ))}
              </Reveal>
              <div className="grid gap-8 sm:grid-cols-2 lg:gap-10">
                {certificaciones.map((cert, indice) => (
                  <Reveal key={cert.nombre} variante="derecha" retraso={indice * 120}>
                  <div className="item-interactivo -m-2 flex h-full gap-4 rounded-md p-2">
                    <VerifiedIcon className="mt-0.5 h-6 w-6 shrink-0 text-primary" />
                    <div>
                      <h3 className="text-lg font-bold text-primary">{cert.nombre}</h3>
                      <p className="mt-2 leading-relaxed text-on-surface-variant">{cert.descripcion}</p>
                      <p className="mt-3 font-mono text-label-xs uppercase text-on-surface-variant">
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
      )}

      <OtrosServicios servicios={servicios} actual={servicio.slug} />
    </>
  )
}
