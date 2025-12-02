// ibe160/__mocks__/server/db.ts
import { jest } from '@jest/globals';

// Mock the Prisma client initialization
export const db = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    // Add other mocked Prisma methods if used in any test
  },
  // Mock other models as needed
};