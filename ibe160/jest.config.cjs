const nextJest = require('next/jest');

// Custom transformation for ESM modules
// NOTE: `ts-jest` needs to be installed for this transform to work.
const esmTransform = {
  '^.+\.(ts|tsx)$': ['ts-jest', {
    useESM: true,
    tsconfig: '<rootDir>/tsconfig.json',
  }],
  '^.+\.(js|jsx)$': ['babel-jest', {
    presets: [
      ['@babel/preset-env', { targets: { node: 'current' } }],
      'next/babel', // Includes @babel/preset-react
    ],
  }],
};


// Transform ignore patterns to explicitly allow transformation of certain ESM packages
const esmTransformIgnorePatterns = [
  // Do NOT transform commonjs modules, BUT transform specific ESM modules that Jest struggles with
  '/node_modules/(?!superjson|@auth\/prisma-adapter|@prisma\/client|pdf-parse|mammoth)/',
];

// Create a Jest config for client-side (app) tests
const createClientJestConfig = nextJest({
  dir: './', // Path to the Next.js app directory
})

// Create a Jest config for server-side tests (api, server)
const createServerJestConfig = nextJest({
  dir: './', // Path to the Next.js app directory
})

async function setupJestProjects() {
  // Set environment variables for testing purposes, especially for @t3-oss/env-nextjs validation
  process.env.AUTH_SECRET = process.env.AUTH_SECRET || "dummy_auth_secret";
  process.env.AUTH_DISCORD_ID = process.env.AUTH_DISCORD_ID || "dummy_discord_id";
  process.env.AUTH_DISCORD_SECRET = process.env.AUTH_DISCORD_SECRET || "dummy_discord_secret";
  process.env.DATABASE_URL = process.env.DATABASE_URL || "postgresql://dummy_user:dummy_password@dummy_host:5432/dummy_database";
  process.env.CANVAS_API_URL = process.env.CANVAS_API_URL || "https://dummy.canvas.com";
  process.env.CANVAS_API_TOKEN = process.env.CANVAS_API_TOKEN || "dummy_canvas_token";
  process.env.PINECONE_API_KEY = process.env.PINECONE_API_KEY || "dummy_pinecone_api_key";
  process.env.PINECONE_ENVIRONMENT = process.env.PINECONE_ENVIRONMENT || "dummy_pinecone_environment";
  process.env.PINECONE_INDEX_NAME = process.env.PINECONE_INDEX_NAME || "dummy_pinecone_index_name";
  process.env.OPENAI_API_KEY = process.env.OPENAI_API_KEY || "dummy_openai_api_key";
  process.env.GEMINI_API_KEY = process.env.GEMINI_API_KEY || "dummy_gemini_api_key";
  process.env.PINECONE_API_KEY = process.env.PINECONE_API_KEY || "dummy_pinecone_api_key";
  process.env.PINECONE_ENVIRONMENT = process.env.PINECONE_ENVIRONMENT || "dummy_pinecone_environment";
  process.env.PINECONE_INDEX_NAME = process.env.PINECONE_INDEX_NAME || "dummy_pinecone_index_name";
  process.env.NODE_ENV = process.env.NODE_ENV || "test";

  const commonConfig = {
    rootDir: '.', // Explicitly set rootDir to the current directory
    setupFilesAfterEnv: ['<rootDir>/jest.setup.cjs'], // Changed to .cjs
    moduleNameMapper: {
      '^~/server/db$': '<rootDir>/__mocks__/server/db.ts',
      '^~/(.*)$': '<rootDir>/src/$1',
      '^@prisma/client$': '<rootDir>/src/__mocks__/@prisma/client.ts',
      'pdf-parse$': '<rootDir>/src/__mocks__/pdf-parse.ts',
      'mammoth$': '<rootDir>/src/__mocks__/mammoth.ts',
      'openai$': '<rootDir>/__mocks__/openai.ts',
    },
    extensionsToTreatAsEsm: ['.ts', '.tsx'],
    moduleFileExtensions: ['js', 'mjs', 'cjs', 'ts', 'tsx', 'json', 'node'],
    clearMocks: true,
  };

  const clientCustomConfig = {
    ...commonConfig,
    displayName: 'client',
    testEnvironment: 'jest-environment-jsdom',
    testMatch: ['<rootDir>/src/app/**/*.test.ts?(x)'],
    transform: esmTransform, // Use custom transform
    transformIgnorePatterns: esmTransformIgnorePatterns,
    moduleNameMapper: {
      ...commonConfig.moduleNameMapper, // Merge common moduleNameMapper
      '^~/utils/api$': '<rootDir>/__mocks__/utils/api.ts',
    },
  };

  const serverCustomConfig = {
    ...commonConfig,
    displayName: 'server',
    testEnvironment: 'node',
    testMatch: ['<rootDir>/src/server/**/*.test.ts?(x)'],
    transform: esmTransform, // Use custom transform
    transformIgnorePatterns: esmTransformIgnorePatterns,
  };

  const clientConfig = await createClientJestConfig(clientCustomConfig)();
  return {
    projects: [clientConfig, serverCustomConfig], // Use serverCustomConfig directly
  };
}

module.exports = setupJestProjects();