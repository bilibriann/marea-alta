import { createHash, timingSafeEqual } from 'node:crypto'
import type { Role } from './auth'

// Hashear a longitud fija antes de comparar: timingSafeEqual lanza si los
// buffers tienen largos distintos, lo que filtraría el largo del secreto
// si se comparara el password crudo contra el candidato.
function safeCompare(a: string, b: string): boolean {
  const hashA = createHash('sha256').update(a).digest()
  const hashB = createHash('sha256').update(b).digest()
  return timingSafeEqual(hashA, hashB)
}

export function checkPassword(password: string): Role | null {
  const client = process.env.ADMIN_PASSWORD_CLIENT
  const dev = process.env.ADMIN_PASSWORD_DEV

  if (client && safeCompare(password, client)) return 'client'
  if (dev && safeCompare(password, dev)) return 'dev'
  return null
}
