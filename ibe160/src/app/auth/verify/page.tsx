'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '~/trpc/react'; // Assuming tRPC client setup
import { TRPCClientError } from '@trpc/client';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState('Verifying your email...');
  const [isError, setIsError] = useState(false);

  const verifyEmailMutation = api.auth.verifyEmail.useMutation({
    onSuccess: () => {
      setMessage('Email verified successfully! Redirecting to login...');
      setTimeout(() => {
        router.push('/auth/login'); // AC: #3 User is redirected to a login page or a success message after verification.
      }, 3000);
    },
    onError: (error) => {
      setIsError(true);
      if (error instanceof TRPCClientError) {
        setMessage(`Verification failed: ${error.message}`);
      } else {
        setMessage('Verification failed. Please try again.');
      }
    },
  });

  useEffect(() => {
    const token = searchParams.get('token');

    if (token) {
      verifyEmailMutation.mutate({ token });
    } else {
      setIsError(true);
      setMessage('No verification token found.');
    }
  }, [searchParams, verifyEmailMutation]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-3xl font-bold text-gray-800">Email Verification</h1>
        <p className={`text-center text-lg ${isError ? 'text-red-600' : 'text-gray-700'}`}>
          {message}
        </p>
        {!isError && verifyEmailMutation.isLoading && (
          <div className="mt-4 text-center">
            <svg
              className="mx-auto h-8 w-8 animate-spin text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}
