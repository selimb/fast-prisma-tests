/**
 * Creates an event for synchronization between promises.
 * This is similar to events in languages that make use of threads.
 */
export function Event(): {
  /** Resolves the event, waking up everyone waiting on `wait()`. */
  set: () => void
  /**
   * Returns a promise that waits for `set()`.
   * If `set()` has already been called, returns immediately.
   */
  wait: () => Promise<void>
} {
  let resolve: () => void
  const p = new Promise<void>((innerResolve) => {
    resolve = innerResolve
  })
  return {
    set: () => resolve(),
    wait: async () => await p,
  }
}
