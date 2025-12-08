// jest.setup.cjs

// Set up environment variables for tests
process.env.CANVAS_API_URL = 'https://canvas.example.com';
process.env.CANVAS_API_TOKEN = 'test-token';
process.env.OPENAI_API_KEY = 'test-openai-key'; // For chatbot tests

// @ts-ignore
require('@testing-library/jest-dom');

// Global mock for @prisma/client to prevent actual PrismaClient instantiation
jest.mock('@prisma/client', () => {
  return {
    Prisma: { // Added Prisma namespace
      Role: {
        STUDENT: 'STUDENT',
        TEACHER: 'TEACHER',
      },
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
  };
});

// Global mock for ~/server/db, which uses PrismaClient
jest.mock('~/server/db', () => {
  return {
    prisma: { // Export `prisma` instead of `db`
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
        findMany: jest.fn(), // Added findMany for potential future use
        // Mock other models as needed
      },
      course: { // Add course mock
          findMany: jest.fn(),
      }
    },
  };
});


// Global mock for next/navigation
jest.mock('next/navigation', () => {
  return {
    useRouter: jest.fn(),
    useSearchParams: jest.fn(),
    redirect: jest.fn(), // Added redirect mock here
    // Mock other named exports as needed
  };
});

// Global mock for next-auth/react', () => {
jest.mock('next-auth/react', () => {
  return {
    signIn: jest.fn(),
    useSession: jest.fn(), // Mock useSession if it's used
    getSession: jest.fn(), // Added getSession mock
  };
});

// Global mock for ~/utils/api (tRPC client)
jest.mock('~/utils/api', () => ({
  api: {
    auth: {
      verifyEmail: {
        useMutation: jest.fn(() => ({
          mutate: jest.fn(),
          isLoading: false,
          isError: false,
          error: null,
        })),
      },
    },
    teacher: {
      listDocuments: {
        useQuery: jest.fn(),
      },
      deleteDocument: {
        useMutation: jest.fn(),
      },
    },
    getSession: jest.fn(),
  },
}));




