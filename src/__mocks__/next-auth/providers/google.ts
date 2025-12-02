// src/__mocks__/next-auth/providers/google.ts

// Minimal mock for the Google provider
export default function Google(options: any) {
  console.log("Mocked Google provider called with options:", options);
  return {
    id: 'google',
    name: 'Google',
    type: 'oauth',
    signinUrl: 'http://localhost:3000/api/auth/signin/google',
    callbackUrl: 'http://localhost:3000/api/auth/callback/google',
    // Add other properties that might be accessed by the actual code
    options: options,
  };
}