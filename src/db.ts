import { Prisma, PrismaClient } from '@prisma/client'

let db: PrismaClient | undefined

export function getDb() {
  if (db) {
    return db
  } else {
    db = new PrismaClient()
    return db
  }
}
