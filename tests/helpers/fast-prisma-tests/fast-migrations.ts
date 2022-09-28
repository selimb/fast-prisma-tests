import { PrismaClient } from '@prisma/client'
import assert from 'assert'
import spawn from 'cross-spawn'
import crypto from 'crypto'
import fs from 'fs/promises'
import { sortBy } from 'lodash'
import path from 'path'
import util from 'util'

import { PROJECT_DIR } from './constants'
import { logTest } from './log-test'

const migrationsDir = path.join(PROJECT_DIR, 'prisma', 'migrations')
const prismaBinary = path.join(PROJECT_DIR, 'node_modules', '.bin', 'prisma')

/**
 * Make sure migrations are up-to-date.
 */
export async function maybeRunMigrations(db: PrismaClient): Promise<void> {
  // This (≈0.05 sec) is a lot faster than systematically running `db push` (≈1 sec).
  if (await shouldRunMigrations(db)) {
    logTest('Running migrations...')
    spawn.sync(
      prismaBinary,
      ['db', 'push', '--accept-data-loss', '--skip-generate'],
      {
        env: process.env,
      }
    )
    logTest('Ran migrations.')
  } else {
    logTest('Skipping migrations.')
  }
}

type Migration = {
  checksum: string
  name: string
}

async function shouldRunMigrations(db: PrismaClient): Promise<boolean> {
  try {
    await db.$connect()
    const migrations = await db.$queryRawUnsafe(
      'SELECT migration_name as name, checksum FROM _prisma_migrations ORDER BY migration_name ASC;'
    )
    const expectedMigrations = await getExpectedMigrations()
    logTest(
      `DB has migrations:\n${util.inspect(
        migrations
      )}\nExpected migrations:\n${util.inspect(expectedMigrations)}`
    )
    return !deepStrictEqual(migrations, expectedMigrations)
  } catch (error) {
    logTest(
      `Uncaught error in ${shouldRunMigrations.name}:\n${util.inspect(error)}`
    )
    return true
  }
}

async function getExpectedMigrations(): Promise<Array<Migration>> {
  const migrations: Array<Migration> = []
  const dirEntries = await fs.readdir(migrationsDir, { withFileTypes: true })
  await Promise.all(
    dirEntries.map(async (entry) => {
      if (!entry.isDirectory()) {
        return
      }
      const dirpath = path.join(migrationsDir, entry.name)
      const migrationFile = path.join(dirpath, 'migration.sql')
      let migrationContents
      try {
        migrationContents = await fs.readFile(migrationFile)
      } catch {
        return
      }
      const checksum = crypto
        .createHash('sha256')
        .update(migrationContents)
        .digest('hex')
      migrations.push({ name: entry.name, checksum })
    })
  )
  return sortBy(migrations, ['name'])
}

function deepStrictEqual<T>(a: T, b: T): boolean {
  try {
    assert.deepStrictEqual(a, b)
    return true
  } catch (error) {
    return false
  }
}
