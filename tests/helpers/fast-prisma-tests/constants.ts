/** Not sure if that's 100% reliable, but relative paths using __dirname are brittle. */
export const PROJECT_DIR = process.cwd()

/** Default postgres schema name. */
export const DEFAULT_PG_SCHEMA_NAME = 'public'

export const PrismaErrorCode = {
  DatabaseDoesNotExist: 'P1003',
}
