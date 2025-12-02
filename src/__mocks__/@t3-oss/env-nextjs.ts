// src/__mocks__/@t3-oss/env-nextjs.ts

// Mock for @t3-oss/env-nextjs
// This mock provides a simplified env object to prevent import errors and satisfy schema checks in tests.
export const env = {
  NODE_ENV: 'test',
  AUTH_SECRET: 'test_auth_secret',
  AUTH_DISCORD_ID: 'test_discord_id',
  AUTH_DISCORD_SECRET: 'test_discord_secret',
  DATABASE_URL: 'sqlite://test.db',
  CANVAS_API_URL: 'https://test.canvas.instructure.com',
  CANVAS_API_TOKEN: 'test_canvas_token',
  PINECONE_API_KEY: 'test_pinecone_api_key',
  PINECONE_ENVIRONMENT: 'test_pinecone_environment',
  PINECONE_INDEX_NAME: 'test_pinecone_index_name',
  OPENAI_API_KEY: 'test_openai_api_key',
  // Add any other environment variables your application expects
};

// Also mock createEnv if necessary, though direct env export is often sufficient for tests
export function createEnv() {
  return {
    server: {},
    client: {},
    runtimeEnv: env,
    // Provide other necessary methods or properties if your tests interact with them
    // e.g., skipValidation: true,
  };
}
