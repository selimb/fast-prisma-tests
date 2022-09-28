import crypto from 'crypto'
import path from 'path'

import { PROJECT_DIR } from './constants'

export const TEST_PATH = expect.getState().testPath

/**
 * Returns a (probably) unique postgres schema name for the current test file.
 */
export function buildUniquePgSchemaName(): string {
  if (!TEST_PATH) {
    throw new Error('Missing test path.')
  }
  const relpath = path.relative(PROJECT_DIR, TEST_PATH)
  // Schema names are restricted to 63 characters
  const lengthMax = 63
  if (relpath.length <= lengthMax) return relpath
  const pathHash = crypto.createHash('sha1').update(relpath).digest('hex')
  const uniqueName = `${relpath}-${pathHash.slice(0, 8)}`
  return uniqueName.slice(uniqueName.length - lengthMax)
}
