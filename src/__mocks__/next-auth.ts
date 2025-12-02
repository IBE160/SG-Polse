// src/__mocks__/next-auth.ts

// Mock for the main 'next-auth' package
// Provides basic types and functions that might be imported directly from 'next-auth'.
// Adjust based on actual usage in the application if more complex mocks are needed.

// Basic mock for the Auth function, if directly imported
export const Auth = jest.fn((options) => {
  console.log("Mocked NextAuth.js Auth function called with options:", options);
  // Return a mocked session or other relevant data
  return {
    signIn: jest.fn(),
    signOut: jest.fn(),
    getSession: jest.fn(),
    // Add other mocks as needed
  };
});

// Mock for default export if any
const defaultExport = {
  Auth,
  // ... other named exports
};
export default defaultExport;

// If specific sub-paths are imported (e.g., 'next-auth/providers/discord'),
// you might need separate mocks for those or extend this one.
// For now, let's assume direct imports from 'next-auth' are handled.
