// Las Serverless Functions de Vercel rechazan cualquier request de más de
// 4.5MB con un 413 (límite duro de la plataforma, no configurable — ver
// https://vercel.com/docs/functions/limitations). Validamos un poco por
// debajo en el cliente para dar un mensaje claro antes de intentar subir,
// en vez de que el usuario vea un 413 críptico después de esperar la subida.
export const TAMANO_MAXIMO_IMAGEN_BYTES = 4 * 1024 * 1024
export const TAMANO_MAXIMO_IMAGEN_MB = TAMANO_MAXIMO_IMAGEN_BYTES / (1024 * 1024)
