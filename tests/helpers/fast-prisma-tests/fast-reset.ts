import { PrismaClient } from '@prisma/client'
import { DEFAULT_PG_SCHEMA_NAME } from './constants'

/**
 * Truncates all tables, except for the migrations table.
 * @param schemaName Name of the postgres schema.
 */
export async function resetDb(
  db: PrismaClient,
  schemaName = DEFAULT_PG_SCHEMA_NAME
) {
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
