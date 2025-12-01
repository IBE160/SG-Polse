import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals'; // Explicit Jest globals
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useRouter, useSearchParams } from 'next/navigation';
// Removed import { api } from '~/utils/api';
import VerifyEmailPage from '~/app/auth/verify/page';
import { TRPCClientError } from '@trpc/client';

// No local tRPC client mock needed, relying on global mock in jest.setup.js

describe('VerifyEmailPage', () => {
  const mockPush = jest.fn();
  const mockMutate = jest.fn();

  beforeEach(() => {
    mockUseRouter.mockReturnValue({
      push: mockPush,
      replace: jest.fn(),
    });
    mockUseSearchParams.mockReturnValue(new URLSearchParams());

    const { api } = jest.requireMock('~/utils/api'); // Get mocked api
    (api.auth.verifyEmail.useMutation as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      isError: false,
      error: null,
    });
    jest.useFakeTimers(); // Control setTimeout
  });

  afterEach(() => {
    jest.runOnlyPendingTimers(); // Clear any pending timers
    jest.useRealTimers();
  });

  it('should display loading message initially', () => {
    render(<VerifyEmailPage />);
    expect(screen.getByText('Verifying your email...')).toBeInTheDocument();
  });

  it('should call verifyEmailMutation with token if found in URL', () => {
    (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams('?token=test-token'));
    render(<VerifyEmailPage />);
    expect(mockMutate).toHaveBeenCalledWith({ token: 'test-token' });
  });

  it('should display error if no token is found in URL', () => {
    render(<VerifyEmailPage />);
    expect(screen.getByText('No verification token found.')).toBeInTheDocument();
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it('should display success message and redirect on successful verification', async () => {
    (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams('?token=valid-token'));
    (api.auth.verifyEmail.useMutation as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      isError: false,
      error: null,
      onSuccess: jest.fn(), // Provide a mock onSuccess to prevent errors if the actual implementation uses it
    });

    render(<VerifyEmailPage />);

    // Simulate success
    (api.auth.verifyEmail.useMutation as jest.Mock).mock.calls[0][0].onSuccess();

    expect(screen.getByText('Email verified successfully! Redirecting to login...')).toBeInTheDocument();

    await waitFor(() => {
      jest.advanceTimersByTime(3000); // Advance timers by 3 seconds
      expect(mockPush).toHaveBeenCalledWith('/auth/login');
    });
  });

  it('should display error message on failed verification (TRPCClientError)', async () => {
    (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams('?token=invalid-token'));
    (api.auth.verifyEmail.useMutation as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      isError: true,
      error: new TRPCClientError('Verification failed from server.'),
    });

    render(<VerifyEmailPage />);

    // Simulate error
    (api.auth.verifyEmail.useMutation as jest.Mock).mock.calls[0][0].onError(new TRPCClientError('Verification failed from server.'));

    expect(screen.getByText('Verification failed: Verification failed from server.')).toBeInTheDocument();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('should display generic error message on failed verification (non-TRPCClientError)', async () => {
    (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams('?token=invalid-token'));
    (api.auth.verifyEmail.useMutation as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      isError: true,
      error: new Error('Network error.'),
    });

    render(<VerifyEmailPage />);

    // Simulate error
    (api.auth.verifyEmail.useMutation as jest.Mock).mock.calls[0][0].onError(new Error('Network error.'));


    expect(screen.getByText('Verification failed. Please try again.')).toBeInTheDocument();
    expect(mockPush).not.toHaveBeenCalled();
  });
});
