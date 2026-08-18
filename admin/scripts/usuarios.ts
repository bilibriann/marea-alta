import bcrypt from 'bcryptjs'
import { prisma } from '../src/lib/db'

const ROLES = ['admin', 'dev'] as const
type Rol = (typeof ROLES)[number]

function isRol(value: string | undefined): value is Rol {
  return !!value && (ROLES as readonly string[]).includes(value)
}

function usage(): never {
  console.log(`
Uso:
  npm run usuarios -- crear <nombreUsuario> <password> <admin|dev>
  npm run usuarios -- listar
  npm run usuarios -- desactivar <nombreUsuario>
  npm run usuarios -- activar <nombreUsuario>
  npm run usuarios -- reset-password <nombreUsuario> <nuevaPassword>
`)
  process.exit(1)
}

function validarPassword(password: string | undefined): asserts password is string {
  if (!password || password.length < 8) {
    console.error('La contraseña debe tener al menos 8 caracteres.')
    process.exit(1)
  }
}

async function crear(nombreUsuario: string | undefined, password: string | undefined, rol: string | undefined) {
  if (!nombreUsuario || !isRol(rol)) usage()
  validarPassword(password)

  const existente = await prisma.usuario.findUnique({ where: { nombreUsuario } })
  if (existente) {
    console.error(`Ya existe un usuario con nombreUsuario "${nombreUsuario}".`)
    process.exit(1)
  }

  const passwordHash = await bcrypt.hash(password, 12)
  const usuario = await prisma.usuario.create({
    data: { nombreUsuario, passwordHash, rol },
  })
  console.log(`Usuario creado: ${usuario.nombreUsuario} (rol: ${usuario.rol}, id: ${usuario.id})`)
}

async function listar() {
  const usuarios = await prisma.usuario.findMany({ orderBy: { fechaCreacion: 'asc' } })
  if (usuarios.length === 0) {
    console.log('No hay usuarios registrados todavía.')
    return
  }
  for (const u of usuarios) {
    console.log(
      `#${u.id}  ${u.nombreUsuario}  rol=${u.rol}  activo=${u.activo}  ultimoAcceso=${u.ultimoAcceso?.toISOString() ?? 'nunca'}`
    )
  }
}

async function setActivo(nombreUsuario: string | undefined, activo: boolean) {
  if (!nombreUsuario) usage()
  try {
    const usuario = await prisma.usuario.update({ where: { nombreUsuario }, data: { activo } })
    console.log(`Usuario "${usuario.nombreUsuario}" ahora está ${activo ? 'activo' : 'desactivado'}.`)
  } catch {
    console.error(`No existe un usuario con nombreUsuario "${nombreUsuario}".`)
    process.exit(1)
  }
}

async function resetPassword(nombreUsuario: string | undefined, nuevaPassword: string | undefined) {
  if (!nombreUsuario) usage()
  validarPassword(nuevaPassword)

  const passwordHash = await bcrypt.hash(nuevaPassword, 12)
  try {
    await prisma.usuario.update({ where: { nombreUsuario }, data: { passwordHash } })
    console.log(`Contraseña actualizada para "${nombreUsuario}".`)
  } catch {
    console.error(`No existe un usuario con nombreUsuario "${nombreUsuario}".`)
    process.exit(1)
  }
}

async function main() {
  const [comando, ...args] = process.argv.slice(2)

  switch (comando) {
    case 'crear':
      await crear(args[0], args[1], args[2])
      break
    case 'listar':
      await listar()
      break
    case 'desactivar':
      await setActivo(args[0], false)
      break
    case 'activar':
      await setActivo(args[0], true)
      break
    case 'reset-password':
      await resetPassword(args[0], args[1])
      break
    default:
      usage()
  }
}

main()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
