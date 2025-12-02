// ibe160/__mocks__/src/env.js
export const env = {
  // Provide dummy values for the required environment variables
  AUTH_SECRET: "dummy_auth_secret",
  AUTH_DISCORD_ID: "dummy_discord_id",
  AUTH_DISCORD_SECRET: "dummy_discord_secret",
  DATABASE_URL: "postgresql://dummy_user:dummy_password@dummy_host:5432/dummy_database",
  CANVAS_API_URL: "https://dummy.canvas.com",
  CANVAS_API_TOKEN: "dummy_canvas_token",
  PINECONE_API_KEY: "dummy_pinecone_api_key",
  PINECONE_ENVIRONMENT: "dummy_pinecone_environment",
  PINECONE_INDEX_NAME: "dummy_pinecone_index_name",
  OPENAI_API_KEY: "dummy_openai_api_key",
  NODE_ENV: "test", // Set NODE_ENV to test
};
