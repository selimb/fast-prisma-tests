const JEST_WORKER_ID_ENV = 'JEST_WORKER_ID'

/**
 * Returns a modified version of `dbUrl` that points to a different database, suitable for parallel testing.
 */
export function buildParallelDbUrl(dbUrl: string): string {
  const workerId = process.env[JEST_WORKER_ID_ENV]
  if (!workerId) {
    throw new Error(`Missing '${JEST_WORKER_ID_ENV}'.`)
  }
  const url = new URL(dbUrl)
  const prefix = url.pathname || 'test'
  url.pathname = `${prefix}-${workerId}`
  return url.toString()
}
