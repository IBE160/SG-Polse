import '@testing-library/jest-dom';
import 'jest-fetch-mock';
import { jest } from '@jest/globals';

// Global mock for @prisma/client to prevent actual PrismaClient instantiation
jest.mock('@prisma/client', () => ({
  Role: {
    STUDENT: 'STUDENT',
    TEACHER: 'TEACHER',
  },
  PrismaClient: jest.fn(() => ({
    $connect: jest.fn(),
    $disconnect: jest.fn(),
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    // Mock other models as needed
  })),
}));

// Global mock for ~/server/db, which uses PrismaClient
jest.mock('~/server/db', () => ({
  db: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      // Add other mocked Prisma methods if used in any test
    },
    // Mock other models as needed
  },
}));

// Global mock for next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
  redirect: jest.fn(), // Added redirect mock here
  // Mock other named exports as needed
}));

// Global mock for next-auth/react
jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
  useSession: jest.fn(), // Mock useSession if it's used
  getSession: jest.fn(), // Added getSession mock
}));

// Global mock for ~/utils/api (tRPC client)
jest.mock('~/utils/api', () => ({
  api: {
    auth: {
      verifyEmail: {
        useMutation: jest.fn(),
      },
    },
    // Mock other tRPC procedures as needed
  },
}));