const { defaults } = require('jest-config')

/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  preset: 'ts-jest',
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'mjs'],
  setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],
}

module.exports = config
