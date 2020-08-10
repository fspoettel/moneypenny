module.exports = {
  collectCoverageFrom: [
    './src/**/*.js',
    '!./src/db/*',
    '!./src/**/*.spec.js'
  ],
  testEnvironment: 'node',
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
  setupFiles: ['<rootDir>/jest.setup.js']
}
