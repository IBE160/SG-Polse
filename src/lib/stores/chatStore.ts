// src/lib/stores/chatStore.ts
import { create } from 'zustand';
import { ChatMessage } from '~/lib/types/chat'; // Import the ChatMessage type
import { v4 as uuidv4 } from 'uuid';

interface ChatStore {
  messages: ChatMessage[];
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  updateMessage: (id: string, updates: Partial<ChatMessage>) => void;
  clearConversation: () => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, { ...message, id: uuidv4(), timestamp: new Date() }],
    })),
  updateMessage: (id, updates) =>
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.id === id ? { ...msg, ...updates } : msg
      ),
    })),
  clearConversation: () => set({ messages: [] }),
}));
