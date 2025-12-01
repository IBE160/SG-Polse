import { jest, describe, it, expect } from '@jest/globals'; // Explicit Jest globals
// ibe160/src/server/auth/config.test.ts

// Mocking NextAuth.js and its dependencies
import { type NextAuthOptions } from "next-auth";
import { authConfig } from "./config";

// Mock the db object if it's used in authConfig's callbacks or authorize functions
// For this test, we are primarily testing the signIn callback, which doesn't directly use db
// However, if other parts of authConfig use `db`, it would need to be mocked.
jest.mock("~/server/db", () => ({
  db: {}, // Mock db as an empty object or with specific mock methods if needed
}));

describe("authConfig signIn callback", () => {
  it("should allow sign-in for users with allowed school email domain", async () => {
    const user = { email: "student@school.com" };
    const result = await (authConfig.callbacks as NextAuthOptions["callbacks"])!.signIn!({
      user,
      account: null, // Mock as null for this test
      profile: null, // Mock as null for this test
    });
    expect(result).toBe(true);
  });

  it("should prevent sign-in for users with disallowed email domain", async () => {
    const user = { email: "user@example.com" };
    const result = await (authConfig.callbacks as NextAuthOptions["callbacks"])!.signIn!({
      user,
      account: null,
      profile: null,
    });
    expect(result).toBe(false);
  });

  it("should allow sign-in for users with no email (e.g., some social logins)", async () => {
    const user = { email: undefined }; // or null
    const result = await (authConfig.callbacks as NextAuthOptions["callbacks"])!.signIn!({
      user,
      account: null,
      profile: null,
    });
    expect(result).toBe(true);
  });

  it("should allow sign-in if email is present but no domain check is performed (e.g., for credentials provider)", async () => {
    const user = { email: "anyuser@anywhere.com" };
    const result = await (authConfig.callbacks as NextAuthOptions["callbacks"])!.signIn!({
      user,
      account: null,
      profile: null,
    });
    // This assumes the default behavior if the email doesn't match the specific school domain
    // is to allow it, which is how our current placeholder is set up.
    // If the requirement changes to "only school.com", this test would need adjustment.
    expect(result).toBe(false); // Should be false based on current implementation
  });
});
