import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useRouter, useSearchParams } from 'next/navigation';
import LoginPage from './page'; // Assuming LoginPage component is exported from page.tsx

const mockPush = jest.fn();

describe('LoginPage', () => { // Start of the main describe block
  let mockedSignIn: jest.Mock;

  beforeEach(() => {
    // Get the mocked signIn function
    mockedSignIn = jest.requireMock('next-auth/react').signIn;

    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      replace: jest.fn(),
      // Add other methods as needed
    });
    (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams());
    // Clear mocks before each test
    mockedSignIn.mockClear();
    mockPush.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });




  it('should display the login form', () => {
    render(<LoginPage />);
    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
    expect(screen.getByText(/don't have an account\?/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /register here/i })).toBeInTheDocument();
  });

  it('should handle successful login and redirect', async () => {
    mockedSignIn.mockResolvedValueOnce({ ok: true, error: null });

    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(mockedSignIn).toHaveBeenCalledWith('credentials', {
        redirect: false,
        email: 'test@example.com',
        password: 'password123',
      });
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  it('should display error message for invalid credentials', async () => {
    mockedSignIn.mockResolvedValueOnce({ ok: false, error: 'Invalid credentials' });

    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrongpass' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  it('should display error message for unverified accounts', async () => {
    mockedSignIn.mockResolvedValueOnce({
      ok: false,
      error: 'Please verify your email address before logging in.',
    });

    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'unverified@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText('Please verify your email address before logging in.')).toBeInTheDocument();
      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  it('should display the "Login with School Account" button', () => {
    render(<LoginPage />);
    expect(screen.getByRole('button', { name: /Login with School Account/i })).toBeInTheDocument();
  });

  it('should call signIn with google provider when "Login with School Account" button is clicked', () => {
    render(<LoginPage />);
    fireEvent.click(screen.getByRole('button', { name: /Login with School Account/i }));
    expect(mockedSignIn).toHaveBeenCalledWith('google', { callbackUrl: '/' });
  });

  it('should display OAuth error message from URL parameters', async () => {
    (useRouter as jest.Mock).mockReturnValue({ push: jest.fn() }); // Reset useRouter mock for this test
    (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams('error=OAuthAccountNotLinked'));

    render(<LoginPage />);

    await waitFor(() => {
      expect(screen.getByText('This email is already registered with another account type.')).toBeInTheDocument();
    });
  });
});
