import type { Config } from 'jest';

export default {
  displayName: 'ts-only',
  preset: 'ts-jest',
  testEnvironment: 'node',
  testTimeout: 60000,
  testMatch: ['**/*.test.ts'],
  moduleNameMapper: {
    '^@auth/(.*)$': ['<rootDir>/src/auth/$1'],
    '^@data/(.*)$': '<rootDir>/src/data/$1',
    '^@extensions/(.*)$': ['<rootDir>/src/extensions/$1'],
    '^@routes/(.*)$': ['<rootDir>/src/routes/$1'],
    '^@user/(.*)$': ['<rootDir>/src/user/$1'],
    '^@test/(.*)$': ['<rootDir>/test/$1'],
    '^@/(.*)$': ['./src/$1']
  }
} satisfies Config;
