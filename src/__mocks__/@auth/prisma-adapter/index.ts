// src/__mocks__/@auth/prisma-adapter/index.ts

// Mock for @auth/prisma-adapter
// This mock provides a minimal structure to prevent import errors.
// Adjust as needed based on what parts of PrismaAdapter are actually used in tests.

export function PrismaAdapter(prisma: any) {
  return {
    createUser: jest.fn(),
    getUser: jest.fn(),
    getUserByEmail: jest.fn(),
    getUserByAccount: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
    linkAccount: jest.fn(),
    unlinkAccount: jest.fn(),
    createSession: jest.fn(),
    getSessionAndUser: jest.fn(),
    updateSession: jest.fn(),
    deleteSession: jest.fn(),
    createVerificationToken: jest.fn(),
    useVerificationToken: jest.fn(),
  };
}