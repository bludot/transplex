module.exports = {
  preset: 'ts-jest',
  passWithNoTests: true,
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
  testEnvironment: 'node',
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  transform: {
    '^.+\\.[jt]s$': 'ts-jest',
  },
  coverageDirectory: '../coverage',
  coveragePathIgnorePatterns: [
    'node_modules',
    'test-config',
    'interfaces',
    'jestGlobalMocks.ts',
    '.module.ts',
    'modules/common/pipes/validation.ts',
    '.prototype.ts',
    'modules/logger/*',
    'seed/*',
    'src/db',
  ],
  coverageReporters: ['json', 'lcov', 'text-summary', 'text', 'clover'],
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 80,
      lines: 80,
    },
  },
}
