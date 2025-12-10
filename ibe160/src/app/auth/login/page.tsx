'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { FcGoogle } from 'react-icons/fc';
import { FaDiscord } from 'react-icons/fa';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!searchParams) return;
    const oauthError = searchParams.get('error');
    if (oauthError) {
      // Map NextAuth.js error codes to user-friendly messages
      let errorMessage = 'An unknown error occurred during OAuth login.';
      switch (oauthError) {
        case 'OAuthAccountNotLinked':
          errorMessage = 'This email is already registered with another account type.';
          break;
        case 'Callback':
          errorMessage = 'Authentication failed. Please try again.';
          break;
        case 'AccessDenied':
          errorMessage = 'Access denied by the school\'s identity provider.';
          break;
        // Add more cases for other common errors if needed
        default:
          errorMessage = `Authentication error: ${oauthError.replace(/_/g, ' ')}. Please try again.`;
      }
      setError(errorMessage);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await signIn('credentials', {
      redirect: false, // Do not redirect automatically
      email,
      password,
    });

    setLoading(false);

    if (result?.error) {
      setError(result.error);
    } else {
      // Successful login
      router.push('/'); // Redirect to home page or dashboard
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-3xl font-bold text-gray-800">Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        {error && (
          <p className="mt-4 text-center text-red-600">{error}</p>
        )}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">Or continue with</span>
          </div>
        </div>
        <div className="space-y-4">
          <button
            onClick={() => signIn("google", { callbackUrl: "/student/dashboard" })}
            className="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-3 font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
          >
            <FcGoogle className="mr-3 h-6 w-6" />
            Sign in with Google
          </button>
          <button
            onClick={() => signIn("discord", { callbackUrl: "/student/dashboard" })}
            className="flex w-full items-center justify-center rounded-md border border-transparent bg-[#5865F2] px-4 py-3 font-medium text-white shadow-sm transition-colors hover:bg-[#4752C4]"
          >
            <FaDiscord className="mr-3 h-6 w-6" />
            Sign in with Discord
          </button>
        </div>
        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link href="/auth/register" className="font-medium text-indigo-600 hover:text-indigo-500">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
