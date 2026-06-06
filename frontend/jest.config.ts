import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  // Load local Next.js config and environment files in the Jest context
  dir: './',
});

const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    // Support path aliases matching tsconfig imports
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};

export default createJestConfig(config);
