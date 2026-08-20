import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { randomUUID } from 'node:crypto'

// Node solo acepta tab, ASCII imprimible (0x20-0x7e) y bytes altos (0x80-0xff)
// en un valor de header HTTP (ver checkInvalidHeaderChar en Node, y RFC 9110).
// Cualquier otra cosa —incluyendo caracteres "invisibles" como espacio de
// ancho cero (U+200B) o BOM (U+FEFF), típicos de copiar/pegar desde el
// navegador o apps de texto enriquecido— revienta el SDK de AWS al armar el
// header Authorization con un ERR_INVALID_CHAR genérico que no dice ni la
// variable ni el carácter culpable.
const CARACTER_INVALIDO_EN_HEADER = /[^\t\x20-\x7e\x80-\xff]/g

/**
 * Lee una variable de entorno y le quita cualquier carácter que rompería un
 * header HTTP (no solo en los extremos — un espacio de ancho cero en medio
 * de la credencial no lo saca un `.trim()`).
 */
function envVarLimpia(nombre: string): string | undefined {
  const valor = process.env[nombre]
  if (valor === undefined) return undefined
  return valor.replace(CARACTER_INVALIDO_EN_HEADER, '').trim()
}

// Cliente S3 genérico: en desarrollo apunta al MinIO de docker-compose.yml,
// en producción a Cloudflare R2 (mismo protocolo, ambos S3-compatible). Lo
// único que cambia entre entornos son las variables de entorno R2_*.
function getClient(): S3Client {
  const endpoint = envVarLimpia('R2_ENDPOINT')
  const accessKeyId = envVarLimpia('R2_ACCESS_KEY_ID')
  const secretAccessKey = envVarLimpia('R2_SECRET_ACCESS_KEY')
  if (!endpoint || !accessKeyId || !secretAccessKey) {
    throw new Error('Variables de entorno R2_ENDPOINT/R2_ACCESS_KEY_ID/R2_SECRET_ACCESS_KEY no configuradas.')
  }
  return new S3Client({
    region: 'auto',
    endpoint,
    forcePathStyle: true,
    credentials: { accessKeyId, secretAccessKey },
  })
}

function getBucket(): string {
  const bucket = envVarLimpia('R2_BUCKET')
  if (!bucket) throw new Error('Variable de entorno R2_BUCKET no configurada.')
  return bucket
}

function getPublicBaseUrl(): string {
  const base = envVarLimpia('R2_PUBLIC_BASE_URL')
  if (!base) throw new Error('Variable de entorno R2_PUBLIC_BASE_URL no configurada.')
  return base.replace(/\/$/, '')
}

export interface ImagenSubida {
  key: string
  url: string
}

/**
 * Sube una imagen y devuelve su key (para poder borrarla después) y su URL
 * pública. `carpeta` agrupa por entidad (ej. "productos", "noticias").
 */
export async function subirImagen(
  buffer: Buffer,
  opciones: { carpeta: 'productos' | 'noticias'; nombreArchivo: string; contentType: string }
): Promise<ImagenSubida> {
  const extension = opciones.nombreArchivo.includes('.')
    ? opciones.nombreArchivo.split('.').pop()
    : undefined
  const key = `${opciones.carpeta}/${randomUUID()}${extension ? `.${extension}` : ''}`

  await getClient().send(
    new PutObjectCommand({
      Bucket: getBucket(),
      Key: key,
      Body: buffer,
      ContentType: opciones.contentType,
    })
  )

  return { key, url: `${getPublicBaseUrl()}/${key}` }
}

export async function eliminarImagen(key: string): Promise<void> {
  await getClient().send(new DeleteObjectCommand({ Bucket: getBucket(), Key: key }))
}

/** Deriva la key (path dentro del bucket) a partir de una URL pública ya guardada. */
export function keyDesdeUrl(url: string): string {
  const base = getPublicBaseUrl()
  return url.startsWith(base) ? url.slice(base.length + 1) : url
}
