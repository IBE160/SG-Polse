// src/app/chat/page.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import ChatPage from './page';
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

// Mock next-auth and next/navigation
jest.mock("next-auth", () => ({
  getServerSession: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

describe('ChatPage', () => {
  beforeEach(() => {
    // Reset mocks before each test
    (getServerSession as jest.Mock).mockReset();
    (redirect as jest.Mock).mockReset();
  });

  it('redirects unauthenticated users to sign-in page', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null); // Simulate no session

    render(<ChatPage />);

    await waitFor(() => {
      expect(redirect).toHaveBeenCalledWith("/api/auth/signin");
    });
  });

  it('renders the chat interface for authenticated users', async () => {
    (getServerSession as jest.Mock).mockResolvedValue({ user: { name: 'Test User' } }); // Simulate an authenticated session

    render(<ChatPage />);

    await waitFor(() => {
      expect(redirect).not.toHaveBeenCalled(); // Ensure no redirection
      expect(screen.getByText('Chatbot Interface')).toBeInTheDocument();
      expect(screen.getByText('Your conversation will appear here...')).toBeInTheDocument();
      expect(screen.getByText('Input field and send button will go here.')).toBeInTheDocument();
    });
  });
});
