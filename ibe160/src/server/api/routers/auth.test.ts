import { describe, it, expect } from '@jest/globals'; // Explicit Jest globals
import { type Session } from "next-auth";
import { appRouter } from "~/server/api/root";
import { createInnerTRPCContext } from "~/server/api/trpc";
import { jest } from '@jest/globals'; // Import jest for mocking

// Mock Prisma Client without jest.requireActual
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

// Mock the ~/server/db module
jest.mock("~/server/db", () => ({
  db: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

import { Role } from '@prisma/client'; // Import Role from the mock


describe("authRouter", () => {
  it("getSession should return the session object", async () => {
    const mockSession: Session = {
      user: {
        id: "test-user-id",
        name: "Test User",
        email: "test@example.com",
        role: Role.STUDENT,
      },
      expires: new Date(Date.now() + 3600 * 1000).toISOString(),
    };

    const caller = appRouter.createCaller(createInnerTRPCContext({ session: mockSession }));

    const result = await caller.auth.getSession();

    expect(result).toBe(mockSession);
  });

  it("getUserRole should return the user's role from the session", async () => {
    const mockSession: Session = {
      user: {
        id: "test-user-id",
        name: "Test User",
        email: "test@example.com",
        role: Role.TEACHER,
      },
      expires: new Date(Date.now() + 3600 * 1000).toISOString(),
    };

    const caller = appRouter.createCaller(createInnerTRPCContext({ session: mockSession }));

    const result = await caller.auth.getUserRole();

    expect(result).toBe(Role.TEACHER);
  });

  it("getUserRole should throw an error if there is no session", async () => {
    const caller = appRouter.createCaller(createInnerTRPCContext({ session: null }));

    await expect(caller.auth.getUserRole()).rejects.toThrow("UNAUTHORIZED");
  });
});