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
  const commonConfig = {
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    moduleNameMapper: {
      '^~/(.*)$': '<rootDir>/src/$1',
      '^@prisma/client$': '<rootDir>/src/__mocks__/@prisma/client.ts',
      '^~/trpc/react$': '<rootDir>/src/utils/api.ts', // Explicitly map trpc/react to utils/api
      'pdf-parse$': '<rootDir>/src/__mocks__/pdf-parse.ts',
      'mammoth$': '<rootDir>/src/__mocks__/mammoth.ts',
      'openai$': '<rootDir>/src/__mocks__/openai.ts',
    },
    extensionsToTreatAsEsm: ['.ts', '.tsx'],
    moduleFileExtensions: ['js', 'mjs', 'cjs', 'ts', 'tsx', 'json', 'node'],
    clearMocks: true,
    collectCoverage: false, // Set to true if coverage is needed
    // preset: 'ts-jest/presets/default-esm', // Moved custom transform to override next/jest
  };

  const clientCustomConfig = {
    ...commonConfig,
    displayName: 'client',
    testEnvironment: 'jest-environment-jsdom',
    testMatch: ['<rootDir>/src/app/**/*.test.ts?(x)'],
    transform: esmTransform, // Use custom transform
    transformIgnorePatterns: esmTransformIgnorePatterns,
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
  const serverConfig = await createServerJestConfig(serverCustomConfig)();

  return {
    projects: [clientConfig, serverConfig],
  };
}

module.exports = setupJestProjects();