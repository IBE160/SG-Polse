// ibe160/__mocks__/utils/api.ts
import { jest } from '@jest/globals';

export const api = {
  auth: {
    verifyEmail: {
      useMutation: jest.fn(), // Changed this line
    },
    getSession: jest.fn(),
  },
  teacher: {
    getTeacherCourses: {
      useQuery: jest.fn(), // Changed this line
    },
  },
};

// Mock `TRPCClientError` if it's imported
export class TRPCClientError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TRPCClientError';
  }
}