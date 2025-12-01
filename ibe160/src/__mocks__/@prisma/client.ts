// ibe160/src/__mocks__/@prisma/client.ts

import { jest } from '@jest/globals';

export const Role = {
  STUDENT: 'STUDENT',
  TEACHER: 'TEACHER',
};

export const PrismaClient = jest.fn(() => ({
  $connect: jest.fn(),
  $disconnect: jest.fn(),
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
  // Mock other models as needed
}));
