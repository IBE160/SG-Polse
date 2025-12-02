// src/app/_components/chatbot/TextInput.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TextInput from './TextInput';
import '@testing-library/jest-dom';

describe('TextInput', () => {
  const mockOnSendMessage = jest.fn();

  beforeEach(() => {
    mockOnSendMessage.mockClear();
  });

  it('renders the input field and send button', () => {
    render(<TextInput onSendMessage={mockOnSendMessage} isLoading={false} />);
    expect(screen.getByPlaceholderText('Type your question...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument(); // Adjust name if button has no text
  });

  it('updates input value on change', () => {
    render(<TextInput onSendMessage={mockOnSendMessage} isLoading={false} />);
    const inputElement = screen.getByPlaceholderText('Type your question...') as HTMLInputElement;
    fireEvent.change(inputElement, { target: { value: 'Hello chatbot' } });
    expect(inputElement.value).toBe('Hello chatbot');
  });

  it('enables send button when input has text', () => {
    render(<TextInput onSendMessage={mockOnSendMessage} isLoading={false} />);
    const inputElement = screen.getByPlaceholderText('Type your question...') as HTMLInputElement;
    const sendButton = screen.getByRole('button', { name: /send/i });

    fireEvent.change(inputElement, { target: { value: 'Test message' } });
    expect(sendButton).not.toBeDisabled();
  });

  it('disables send button when input is empty', () => {
    render(<TextInput onSendMessage={mockOnSendMessage} isLoading={false} />);
    const sendButton = screen.getByRole('button', { name: /send/i });
    expect(sendButton).toBeDisabled();
  });

  it('calls onSendMessage and clears input on submit', async () => {
    render(<TextInput onSendMessage={mockOnSendMessage} isLoading={false} />);
    const inputElement = screen.getByPlaceholderText('Type your question...') as HTMLInputElement;
    const sendButton = screen.getByRole('button', { name: /send/i });

    fireEvent.change(inputElement, { target: { value: 'My question' } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(mockOnSendMessage).toHaveBeenCalledTimes(1);
      expect(mockOnSendMessage).toHaveBeenCalledWith('My question');
      expect(inputElement.value).toBe('');
    });
  });

  it('does not call onSendMessage if input is empty on submit', () => {
    render(<TextInput onSendMessage={mockOnSendMessage} isLoading={false} />);
    const sendButton = screen.getByRole('button', { name: /send/i });
    fireEvent.click(sendButton);
    expect(mockOnSendMessage).not.toHaveBeenCalled();
  });

  it('disables input and button when isLoading is true', () => {
    render(<TextInput onSendMessage={mockOnSendMessage} isLoading={true} />);
    const inputElement = screen.getByPlaceholderText('Thinking...') as HTMLInputElement;
    const sendButton = screen.getByRole('button', { name: /send/i });

    expect(inputElement).toBeDisabled();
    expect(sendButton).toBeDisabled();
  });
});