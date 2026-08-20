import readline from 'node:readline'
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
  npm run usuarios -- crear <nombreUsuario> <admin|dev>
  npm run usuarios -- listar
  npm run usuarios -- desactivar <nombreUsuario>
  npm run usuarios -- activar <nombreUsuario>
  npm run usuarios -- reset-password <nombreUsuario>

"crear" y "reset-password" piden la contraseña de forma interactiva
(oculta, con confirmación) — no se pasa como argumento.
`)
  process.exit(1)
}

/**
 * Pide contraseña + confirmación por stdin sin hacer eco de lo que se
 * escribe. readline no tiene una opción pública para ocultar el input;
 * interceptar _writeToOutput es el mecanismo estándar para lograrlo (usado
 * por la mayoría de las CLIs de Node que no quieren sumar una dependencia
 * solo para esto).
 *
 * Encadenamos la segunda pregunta *dentro* del callback de la primera (en
 * vez de usar await entre ambas) a propósito: con stdin no interactivo
 * (pipes, como en los tests) hay una condición de carrera real donde el
 * stream llega a EOF entre el resolve de la primera promesa y el
 * `rl.question` de la segunda, perdiendo la segunda línea silenciosamente.
 * Encadenar por callback evita el gap de microtask entre ambas preguntas.
 */
function pedirPasswordConfirmada(): Promise<string> {
  return new Promise((resolvePromise) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout })

    function preguntarOculto(mensaje: string, cb: (respuesta: string) => void) {
      const rlInterno = rl as unknown as { _writeToOutput: (s: string) => void }
      const escribirOriginal = rlInterno._writeToOutput.bind(rl)
      rlInterno._writeToOutput = (s: string) => {
        escribirOriginal(s.includes(mensaje) ? s : '')
      }
      rl.question(mensaje, (respuesta) => {
        process.stdout.write('\n')
        cb(respuesta)
      })
    }

    preguntarOculto('Contraseña: ', (password) => {
      if (password.length < 8) {
        rl.close()
        console.error('La contraseña debe tener al menos 8 caracteres.')
        process.exit(1)
      }
      preguntarOculto('Repite la contraseña: ', (confirmacion) => {
        rl.close()
        if (password !== confirmacion) {
          console.error('Las contraseñas no coinciden.')
          process.exit(1)
        }
        resolvePromise(password)
      })
    })
  })
}

async function crear(nombreUsuario: string | undefined, rol: string | undefined) {
  if (!nombreUsuario || !isRol(rol)) usage()

  const existente = await prisma.usuario.findUnique({ where: { nombreUsuario } })
  if (existente) {
    console.error(`Ya existe un usuario con nombreUsuario "${nombreUsuario}".`)
    process.exit(1)
  }

  const password = await pedirPasswordConfirmada()
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

async function resetPassword(nombreUsuario: string | undefined) {
  if (!nombreUsuario) usage()

  const existente = await prisma.usuario.findUnique({ where: { nombreUsuario } })
  if (!existente) {
    console.error(`No existe un usuario con nombreUsuario "${nombreUsuario}".`)
    process.exit(1)
  }

  const password = await pedirPasswordConfirmada()
  const passwordHash = await bcrypt.hash(password, 12)
  await prisma.usuario.update({ where: { nombreUsuario }, data: { passwordHash } })
  console.log(`Contraseña actualizada para "${nombreUsuario}".`)
}

async function main() {
  const [comando, ...args] = process.argv.slice(2)

  switch (comando) {
    case 'crear':
      await crear(args[0], args[1])
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
      await resetPassword(args[0])
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
