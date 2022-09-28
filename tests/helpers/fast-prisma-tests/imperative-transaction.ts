import util from 'util'
import { Prisma, PrismaClient } from '@prisma/client'
import { Event } from './event'
import { logTest } from './log-test'

export type ImperativeTransaction = {
  tx: Prisma.TransactionClient
  rollback: () => Promise<void>
}

/**
 * Imperative interface to transactions.
 * Workaround for https://github.com/prisma/prisma/issues/12458
 * Can eventually be replaced when Prisma Client Extensions become available (https://github.com/prisma/prisma/issues/12458#issuecomment-1233503358)
 */
export async function imperativeTransaction(
  prismaClient: PrismaClient,
  transactionOpts?: Parameters<PrismaClient['$transaction']>[1]
): Promise<ImperativeTransaction> {
  const rollbackStartEvent = Event()
  const rollbackDoneEvent = Event()
  const rollbackError = new Error('rollback')
  const tx = await new Promise<Prisma.TransactionClient>((resolve) => {
    logTest('Starting new test transaction...')
    prismaClient
      .$transaction(async (tx) => {
        logTest('Started new test transaction.')
        resolve(tx)
        await rollbackStartEvent.wait()
        logTest('Rolling back test transaction...')
        throw rollbackError
      }, transactionOpts)
      .catch((error: unknown) => {
        if (error !== rollbackError)
          logTest(`Unexpected error in transaction: ${util.inspect(error)}`)
      })
      .finally(() => {
        logTest('Rolled back test transaction.')
        rollbackDoneEvent.set()
      })
  })

  const rollback = async () => {
    rollbackStartEvent.set()
    await rollbackDoneEvent.wait()
  }

  return { tx, rollback }
}
