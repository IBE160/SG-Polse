// src/app/_components/chatbot/ChatMessage.test.tsx
import { render, screen } from '@testing-library/react';
import ChatMessage from './ChatMessage';
import { ChatMessage as ChatMessageType } from '~/lib/types/chat'; // Assuming path to your type definition
import '@testing-library/jest-dom';

describe('ChatMessage', () => {
  it('renders a user message correctly', () => {
    const userMessage: ChatMessageType = {
      id: '1',
      text: 'Hello, bot!',
      sender: 'user',
      timestamp: new Date(),
    };
    render(<ChatMessage message={userMessage} />);
    const messageElement = screen.getByText('Hello, bot!');
    expect(messageElement).toBeInTheDocument();
    expect(messageElement.closest('div')).toHaveClass('bg-purple-600 text-white self-end');
  });

  it('renders a bot message correctly', () => {
    const botMessage: ChatMessageType = {
      id: '2',
      text: 'Hello, user!',
      sender: 'bot',
      timestamp: new Date(),
    };
    render(<ChatMessage message={botMessage} />);
    const messageElement = screen.getByText('Hello, user!');
    expect(messageElement).toBeInTheDocument();
    expect(messageElement.closest('div')).toHaveClass('bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 self-start');
  });

  it('renders a loading message correctly', () => {
    const loadingMessage: ChatMessageType = {
      id: '3',
      text: 'Loading...',
      sender: 'bot',
      timestamp: new Date(),
      isLoading: true,
    };
    render(<ChatMessage message={loadingMessage} />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.getByText('Loading...').closest('div')).toHaveClass('flex space-x-1'); // Check for the bouncing dots container
  });

  it('renders a message with sources correctly, including clickable links', () => {
    const sourcedMessage: ChatMessageType = {
      id: '4',
      text: 'Here is some info.',
      sender: 'bot',
      timestamp: new Date(),
      sources: [
        { documentName: 'Syllabus', pageNumber: 3, url: 'http://example.com/syllabus.pdf' },
        { documentName: 'Assignments', pageNumber: 1 },
      ],
    };
    render(<ChatMessage message={sourcedMessage} />);
    expect(screen.getByText('Here is some info.')).toBeInTheDocument();
    expect(screen.getByText('Sources:')).toBeInTheDocument();

    expect(screen.getByText('Syllabus, Page 3')).toBeInTheDocument();
    const syllabusLink = screen.getByRole('link', { name: 'example.com' });
    expect(syllabusLink).toBeInTheDocument();
    expect(syllabusLink).toHaveAttribute('href', 'http://example.com/syllabus.pdf');
    expect(syllabusLink).toHaveAttribute('target', '_blank');

    expect(screen.getByText('Assignments, Page 1')).toBeInTheDocument();
  });

  it('renders teacher contact information correctly', () => {
    const teacherContactMessage: ChatMessageType = {
      id: '6',
      text: "I can't answer that question.",
      sender: 'bot',
      timestamp: new Date(),
      teacherContactInfo: {
        method: 'Email',
        details: 'teacher@example.com',
      },
    };
    render(<ChatMessage message={teacherContactMessage} />);
    expect(screen.getByText("I can't answer that question.")).toBeInTheDocument();
    expect(screen.getByText('Contact Teacher:')).toBeInTheDocument();
    expect(screen.getByText('Method: Email')).toBeInTheDocument();
    expect(screen.getByText('Details: teacher@example.com')).toBeInTheDocument();
  });
});
