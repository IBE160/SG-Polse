import NextAuth from 'next-auth';
import { authConfig } from './config';

// Initialize NextAuth with the edge-safe configuration.
// This `auth` function is specifically for use in middleware.
export const { auth } = NextAuth(authConfig);
