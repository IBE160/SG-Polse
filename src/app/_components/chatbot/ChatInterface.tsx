// src/app/_components/chatbot/ChatInterface.tsx
import React, { useEffect } from 'react';
import TextInput from './TextInput';
import ChatMessage from './ChatMessage';
import { ChatMessage as ChatMessageType } from '~/types/chat'; // Adjusted import for ChatMessageType
import { useChatStore } from '~/lib/stores/chatStore';
import { v4 as uuidv4 } from 'uuid';
import { api } from '~/utils/api'; // Import the tRPC API client

const ChatInterface: React.FC = () => {
  const { messages, addMessage, updateMessage } = useChatStore();
  const [isSendingMessage, setIsSendingMessage] = React.useState(false);

  const { mutate: queryChatbot, isLoading: isQueryingChatbot } = api.chatbot.queryChatbot.useMutation();

  useEffect(() => {
    if (messages.length === 0) {
      addMessage({
        id: uuidv4(), // Assign a unique ID to the welcome message
        text: "Welcome to your Course-FAQ Chatbot! How can I help you today?",
        sender: "bot",
      });
    }
  }, [messages.length, addMessage]);

  const handleSendMessage = (message: string) => {
    const userMessageId = uuidv4();
    addMessage({ id: userMessageId, text: message, sender: "user" });
    setIsSendingMessage(true);

    const botLoadingMessageId = uuidv4();
    addMessage({
      id: botLoadingMessageId,
      text: "Thinking...",
      sender: "bot",
      isLoading: true,
    });

    // Prepare conversation history for the LLM
    const conversationHistory: ChatMessageType[] = messages.map(msg => ({
      sender: msg.sender,
      text: msg.text,
    }));

    queryChatbot(
      {
        message,
        conversationHistory,
      },
      {
        onSuccess: (data) => {
          updateMessage(botLoadingMessageId, {
            text: data.response,
            isLoading: false,
          });
          setIsSendingMessage(false);
        },
        onError: (error) => {
          updateMessage(botLoadingMessageId, {
            text: `Error: ${error.message}`,
            isLoading: false,
          });
          setIsSendingMessage(false);
        },
      }
    );
  };

  useEffect(() => {
    setIsSendingMessage(isQueryingChatbot);
  }, [isQueryingChatbot]);


  return (
    <div data-testid="chat-interface-container" className="flex flex-col h-full bg-gray-50 dark:bg-gray-950 rounded-lg shadow-md p-4">
      <div data-testid="messages-display-area" className="flex-1 overflow-y-auto p-4 space-y-4 bg-white dark:bg-gray-800 rounded-lg shadow-inner">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
      </div>

      <div className="mt-4">
        <TextInput onSendMessage={handleSendMessage} isLoading={isSendingMessage} />
      </div>
    </div>
  );
};

export default ChatInterface;