/**
 * Franja de aviso entre el navbar y el hero. A esa altura el header (bg-primary)
 * y la cabecera del hero son ambos azul profundo, así que la banda usa el mismo
 * primary en vez de un tono claro: partir dos superficies oscuras con una franja
 * crema sería cualquier cosa menos leve. Solo la separan dos hairlines blancas.
 *
 * Sin <Reveal> a propósito: está sobre el fold y el aviso debe leerse desde el
 * primer pintado, no esperar a que hidrate el IntersectionObserver.
 */
export function EnConstruccionSection() {
  return (
    <section className="border-b border-white/10 bg-primary py-3">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-4 px-4 md:px-12">
        <span aria-hidden className="h-px w-10 bg-white/20" />
        <p className="font-mono text-label-sm font-bold uppercase tracking-widest text-white/70">
          Sitio en construcción
        </p>
        <span aria-hidden className="h-px w-10 bg-white/20" />
      </div>
    </section>
  )
}
