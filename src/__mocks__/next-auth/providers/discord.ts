// src/__mocks__/next-auth/providers/discord.ts

// Minimal mock for the Discord provider
export default function Discord(options: any) {
  console.log("Mocked Discord provider called with options:", options);
  return {
    id: 'discord',
    name: 'Discord',
    type: 'oauth',
    signinUrl: 'http://localhost:3000/api/auth/signin/discord',
    callbackUrl: 'http://localhost:3000/api/auth/callback/discord',
    // Add other properties that might be accessed by the actual code
    options: options,
  };
}