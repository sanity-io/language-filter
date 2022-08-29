/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['.yalc', 'node_modules', '.idea', 'lib', '.parcel-cache'],
  globals: {
    'ts-jest': {
      babelConfig: true,
    },
  },
  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest',
    '^.+\\.(mjs|js|jsx)$': 'babel-jest',
  },
  transformIgnorePatterns: ['node_modules/(?!(nanoid|uuid|get-random-values-esm))'],
}
