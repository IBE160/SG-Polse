// src/app/_components/chatbot/ChatInterface.test.tsx
import { render, screen } from '@testing-library/react';
import ChatInterface from './ChatInterface';

describe('ChatInterface', () => {
  it('renders the chat interface layout correctly', () => {
    render(<ChatInterface />);

    // Check for the main container
    const mainContainer = screen.getByTestId('chat-interface-container'); // Add data-testid to main div in component
    expect(mainContainer).toBeInTheDocument();
    expect(mainContainer).toHaveClass('flex flex-col h-full bg-gray-50 dark:bg-gray-950 rounded-lg shadow-md p-4');

    // Check for the messages display area
    const messagesDisplayArea = screen.getByTestId('messages-display-area'); // Add data-testid to messages div
    expect(messagesDisplayArea).toBeInTheDocument();
    expect(messagesDisplayArea).toHaveClass('flex-1 overflow-y-auto p-4 space-y-4 bg-white dark:bg-gray-800 rounded-lg shadow-inner');

    // Check for placeholder bot message
    expect(screen.getByText(/Welcome to your Course-FAQ Chatbot!/i)).toBeInTheDocument();
    
    // Check for placeholder user message
    expect(screen.getByText(/What are the deadlines for the next assignment?/i)).toBeInTheDocument();

    // Check for the input area placeholder
    const inputAreaPlaceholder = screen.getByTestId('input-area-placeholder'); // Add data-testid to input area div
    expect(inputAreaPlaceholder).toBeInTheDocument();
    expect(inputAreaPlaceholder).toHaveTextContent('Text input field and send button will be integrated here.');
  });
});
