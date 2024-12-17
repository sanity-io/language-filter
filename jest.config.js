/** @type {import('ts-jest/dist/types').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['.yalc', 'node_modules', '.idea', 'lib', '.parcel-cache'],
  transform: {
    '^.+\\.(ts|tsx)?$': ['ts-jest', {babelConfig: true}],
    '^.+\\.(mjs|js|jsx)$': 'babel-jest',
  },
  transformIgnorePatterns: ['node_modules/(?!(nanoid|uuid|get-random-values-esm))'],
}
