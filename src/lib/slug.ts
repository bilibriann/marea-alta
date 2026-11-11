/**
 * Convierte un nombre de archivo de contenido en un slug ASCII para la URL.
 *
 * El panel admin ya guarda los archivos sin tildes, pero si alguna vez entra un
 * "cómo-…-frío.md" (subido a mano o con otra configuración), la URL igual sale
 * /como-…-frio. Una URL con tildes da 404 en Hostinger.
 */
export function slugDesdeArchivo(file: string): string {
  return file
    .replace(/\.md$/, '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-|-$/g, '')
}
