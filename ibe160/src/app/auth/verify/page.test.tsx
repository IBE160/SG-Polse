import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals'; // Explicit Jest globals
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '~/utils/api'; // Import the mocked API
import VerifyEmailPage from '~/app/auth/verify/page';
import { TRPCClientError } from '@trpc/client';

// Mock next/navigation (these are globally mocked in jest.setup.cjs now)
// jest.mock('next/navigation', () => ({
//   useRouter: jest.fn(),
//   useSearchParams: jest.fn(),
// }));

// Mock ~/utils/api (these are globally mocked in jest.setup.cjs now)
// jest.mock('~/utils/api', () => ({
//   api: {
//     auth: {
//       verifyEmail: {
//         useMutation: jest.fn(),
//       },
//     },
//   },
// }));

const mockPush = jest.fn();
const mockMutate = jest.fn();

// Declare mock functions for next/navigation (globally mocked)
const mockUseRouter = jest.mocked(useRouter);
const mockUseSearchParams = jest.mocked(useSearchParams);

const mockedApiUseMutation = jest.mocked(api.auth.verifyEmail.useMutation);// const mockedApiUseMutation = jest.mocked(api.auth.verifyEmail.useMutation);




describe('VerifyEmailPage', () => {
  jest.useFakeTimers(); // Control setTimeout for all tests in this suite

  beforeEach(() => {
    mockUseRouter.mockReturnValue({
      push: mockPush,
      replace: jest.fn(),
    });
    mockUseSearchParams.mockReturnValue(new URLSearchParams());

    // Configure the mock for useMutation
    mockedApiUseMutation.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      isError: false,
      error: null,
      onSuccess: jest.fn(), // Add a default empty onSuccess
      onError: jest.fn(), // Add a default empty onError
    });

    mockMutate.mockClear(); // Clear specific mutate mock
    mockPush.mockClear(); // Clear specific push mock
  });

  afterEach(() => {
    jest.runOnlyPendingTimers(); // Clear any pending timers
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('should display loading message initially', () => {
    render(<VerifyEmailPage />);
    expect(screen.getByText('Verifying your email...')).toBeInTheDocument();
  });

  it('should call verifyEmailMutation with token if found in URL', () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams('?token=test-token'));
    render(<VerifyEmailPage />);
    expect(mockMutate).toHaveBeenCalledWith({ token: 'test-token' });
  });

  it('should display error if no token is found in URL', () => {
    render(<VerifyEmailPage />);
    expect(screen.getByText('No verification token found.')).toBeInTheDocument();
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it('should display success message and redirect on successful verification', async () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams('?token=valid-token'));
    mockedApiUseMutation.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      isError: false,
      error: null,
      onSuccess: jest.fn(), // Provide a mock onSuccess to prevent errors if the actual implementation uses it
    });

    render(<VerifyEmailPage />);

    // Simulate success
    mockedApiUseMutation.mock.calls[0][0].onSuccess();

    expect(screen.getByText('Email verified successfully! Redirecting to login...')).toBeInTheDocument();

    await waitFor(() => {
      jest.advanceTimersByTime(3000); // Advance timers by 3 seconds
      expect(mockPush).toHaveBeenCalledWith('/auth/login');
    });
  });

  it('should display error message on failed verification (TRPCClientError)', async () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams('?token=invalid-token'));
    mockedApiUseMutation.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      isError: true,
      error: new TRPCClientError('Verification failed from server.'),
    });

    render(<VerifyEmailPage />);

    // Simulate error
    mockedApiUseMutation.mock.calls[0][0].onError(new TRPCClientError('Verification failed from server.'));

    expect(screen.getByText('Verification failed: Verification failed from server.')).toBeInTheDocument();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('should display generic error message on failed verification (non-TRPCClientError)', async () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams('?token=invalid-token'));
    mockedApiUseMutation.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      isError: true,
      error: new Error('Network error.'),
    });

    render(<VerifyEmailPage />);

    // Simulate error
    mockedApiUseMutation.mock.calls[0][0].onError(new Error('Network error.'));


    expect(screen.getByText('Verification failed. Please try again.')).toBeInTheDocument();
    expect(mockPush).not.toHaveBeenCalled();
  });
});