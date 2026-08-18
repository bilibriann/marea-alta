import mysql from 'mysql2/promise'

const globalForDb = globalThis as unknown as { pool?: mysql.Pool }

export function getPool(): mysql.Pool {
  if (!globalForDb.pool) {
    const connectionString = process.env.DATABASE_URL
    if (!connectionString) {
      throw new Error('DATABASE_URL no está configurado.')
    }
    globalForDb.pool = mysql.createPool(connectionString)
  }
  return globalForDb.pool
}
