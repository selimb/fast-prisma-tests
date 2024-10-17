import { PrismaClient } from '@prisma/client'
import { DEFAULT_PG_SCHEMA_NAME } from './constants'

const schemaName = DEFAULT_PG_SCHEMA_NAME

/**
 * Truncates all tables, except for the migrations table.
 */
export async function resetDb(db: PrismaClient) {
  const tables: Array<{ tablename: string }> = await db.$queryRawUnsafe<
    Array<{ tablename: string }>
  >(`SELECT tablename FROM pg_tables WHERE schemaname='${schemaName}'`)
  if (tables.length === 0) {
    return
  }
  const tableNames = tables
    .filter(({ tablename }) => tablename !== '_prisma_migrations')
    .map(({ tablename }) => `"${schemaName}"."${tablename}"`)
  const q = `TRUNCATE TABLE ${tableNames.join(', ')} CASCADE;`
  await db.$executeRawUnsafe(q)
}
