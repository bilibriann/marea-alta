'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { SESSION_COOKIE } from '../auth'

export async function cerrarSesionAction() {
  ;(await cookies()).delete(SESSION_COOKIE)
  redirect('/login')
}
