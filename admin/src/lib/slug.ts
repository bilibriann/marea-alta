export function slugificar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '') // acentos, tras normalizar a forma descompuesta (NFD)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/** Genera un slug único probando sufijos -2, -3, ... contra `existe`. */
export async function slugUnico(
  base: string,
  existe: (slug: string) => Promise<boolean>
): Promise<string> {
  const slugBase = slugificar(base)
  let slug = slugBase
  let intento = 2
  while (await existe(slug)) {
    slug = `${slugBase}-${intento}`
    intento += 1
  }
  return slug
}
