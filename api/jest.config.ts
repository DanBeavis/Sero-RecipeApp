module.exports = {
  roots: [
    '.',
  ],
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  unmockedModulePathPatterns: [
    'express',
  ],
};