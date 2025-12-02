// src/lib/stores/chatStore.test.ts
import { act } from '@testing-library/react';
import { useChatStore } from './chatStore'; // Adjust path as necessary
import { ChatMessage } from '~/lib/types/chat'; // Adjust path as necessary
import { v4 as uuidv4 } from 'uuid'; // Import uuid for unique keys

// Mock uuid to have predictable IDs for testing
jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

describe('useChatStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    act(() => useChatStore.setState({ messages: [] }));
    (uuidv4 as jest.Mock).mockClear(); // Clear mock calls
  });

  it('initializes with an empty message array', () => {
    const { messages } = useChatStore.getState();
    expect(messages).toEqual([]);
  });

  it('addMessage correctly adds a message to the store', () => {
    (uuidv4 as jest.Mock).mockReturnValue('test-id-1');
    const { addMessage } = useChatStore.getState();
    const newMessage: Omit<ChatMessage, 'id' | 'timestamp'> = {
      text: 'Test message',
      sender: 'user',
    };

    act(() => addMessage(newMessage));

    const { messages } = useChatStore.getState();
    expect(messages.length).toBe(1);
    expect(messages[0].text).toBe('Test message');
    expect(messages[0].sender).toBe('user');
    expect(messages[0].id).toBe('test-id-1');
    expect(messages[0].timestamp).toBeInstanceOf(Date);
  });

  it('updateMessage correctly updates an existing message', () => {
    (uuidv4 as jest.Mock).mockReturnValue('test-id-1');
    const { addMessage, updateMessage } = useChatStore.getState();
    const initialMessage: Omit<ChatMessage, 'id' | 'timestamp'> = {
      text: 'Initial message',
      sender: 'bot',
    };

    act(() => addMessage(initialMessage));

    const { messages: messagesBeforeUpdate } = useChatStore.getState();
    const messageId = messagesBeforeUpdate[0].id;

    act(() => updateMessage(messageId, { text: 'Updated message', isLoading: false }));

    const { messages: messagesAfterUpdate } = useChatStore.getState();
    expect(messagesAfterUpdate.length).toBe(1);
    expect(messagesAfterUpdate[0].text).toBe('Updated message');
    expect(messagesAfterUpdate[0].isLoading).toBe(false);
  });

  it('clearConversation correctly clears all messages', () => {
    (uuidv4 as jest.Mock).mockReturnValue('test-id-1');
    const { addMessage, clearConversation } = useChatStore.getState();
    const message1: Omit<ChatMessage, 'id' | 'timestamp'> = { text: 'Msg 1', sender: 'user' };
    const message2: Omit<ChatMessage, 'id' | 'timestamp'> = { text: 'Msg 2', sender: 'bot' };

    act(() => {
      addMessage(message1);
      addMessage(message2);
    });

    expect(useChatStore.getState().messages.length).toBe(2);

    act(() => clearConversation());

    expect(useChatStore.getState().messages).toEqual([]);
  });
});
