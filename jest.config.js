module.exports = {
  testResultsProcessor: 'jest-html-reporter',
  rootDir: './src',
  setupTestFrameworkScriptFile: '<rootDir>/test/setupJest.js',
  setupFiles: ['jest-localstorage-mock'],
  collectCoverage: true,
  coverageDirectory: '<rootDir>/../coverage',
  // coverageThreshold: {
  //   global: {
  //     branches: 100,
  //     functions: 100,
  //     lines: 100,
  //     statements: 100
  //   }
  // },
  collectCoverageFrom: ['**/*.{js,jsx}'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': '<rootDir>/__mocks__/styleMock.js',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/__mocks__/fileMock.js',
  },
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/config/',
    'DebugController',
    '/coverage/',
    'index.js',
    'registerServiceWorker.js',
    '/server/',
    '/src/components/PageComponents/DebugPage/',
    '/__tests__/',
  ],
  testMatch: ['**/__tests__/**/*.js?(x)', '**/?(*.)(spec).js?(x)'],
  coverageReporters: ['lcov'],
};
