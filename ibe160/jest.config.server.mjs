// ibe160/jest.config.server.mjs
import preset from 'ts-jest/presets/default-esm/jest-preset.js';

/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  ...preset,
  displayName: 'server',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/src/server/**/*.test.ts?(x)'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.cjs'],
  moduleNameMapper: {
    '^~/server/db$': '<rootDir>/__mocks__/server/db.ts',
    '^~/(.*)$': '<rootDir>/src/$1',
    '^@prisma/client$': '<rootDir>/src/__mocks__/@prisma/client.ts',
    'pdf-parse$': '<rootDir>/src/__mocks__/pdf-parse.ts',
    'mammoth$': '<rootDir>/src/__mocks__/mammoth.ts',
    'openai$': '<rootDir>/__mocks__/openai.ts',
    '^@supabase/supabase-js$': '<rootDir>/__mocks__/@supabase/supabase-js.ts',
    '^resend$': '<rootDir>/__mocks__/resend.ts',
    '^~/server/services/notification$': '<rootDir>/__mocks__/server/services/notification.ts',
    '^~/server/services/pinecone$': '<rootDir>/__mocks__/server/services/pinecone.ts',
    '^~/env$': '<rootDir>/__mocks__/env.ts',
    '^next$': '<rootDir>/__mocks__/next.ts', // Added mock for 'next'
  },
  extensionsToTreatAsEsm: ['.ts'],
  clearMocks: true,
  transform: {
    ...preset.transform,
  },
};