/** Conditionally log stuff during tests for demo purposes. */
export function logTest(...args: unknown[]) {
  if (process.env.LOGTEST) {
    const timestamp = `[${new Date().toISOString()}]`
    console.debug(timestamp, ...args)
  }
}
