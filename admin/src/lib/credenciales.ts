// Verificación de usuario/contraseña contra la tabla Usuario. bcrypt es
// intensivo en CPU y depende de node:crypto — corre solo en runtime Node
// (Server Actions, API routes), nunca se importa desde proxy.ts (Edge).
import bcrypt from 'bcryptjs'
import { prisma } from './db'
import type { SessionPayload } from './auth'

export async function verificarCredenciales(
  nombreUsuario: string,
  password: string
): Promise<Pick<SessionPayload, 'userId' | 'nombreUsuario' | 'rol'> | null> {
  if (!nombreUsuario || !password) return null

  const usuario = await prisma.usuario.findUnique({ where: { nombreUsuario } })
  if (!usuario || !usuario.activo) return null

  const passwordValida = await bcrypt.compare(password, usuario.passwordHash)
  if (!passwordValida) return null

  await prisma.usuario.update({
    where: { id: usuario.id },
    data: { ultimoAcceso: new Date() },
  })

  return { userId: usuario.id, nombreUsuario: usuario.nombreUsuario, rol: usuario.rol }
}
