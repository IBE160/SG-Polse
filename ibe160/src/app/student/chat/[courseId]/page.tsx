"use client";

import Link from "next/link"; // Import Link
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { api } from '~/utils/api';

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

const ChatPage = () => {
  const params = useParams();
  const courseId = params.courseId as string;
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputValueRef = useRef<HTMLInputElement>(null);

  const { data: initialMessageData, isSuccess } = api.chatbot.getInitialMessage.useQuery(undefined, {
    staleTime: Infinity, // This query should only run once
  });

  // Use useMutation for sending messages
  const sendMessageMutation = api.chatbot.sendMessage.useMutation({
    onMutate: async (newMessage) => {
      // Add user message to display immediately
      setMessages(prev => [...prev, { text: newMessage.message, sender: 'user' }]);
      setInputValue('');
      // Optimistically add a "Thinking..." message
      setMessages(prev => [...prev, { text: 'Thinking...', sender: 'bot' }]);
    },
    onSuccess: (data) => {
      setMessages(prev => {
        // Remove the "Thinking..." message and add the actual bot response
        const newMessages = prev.slice(0, prev.length - 1); // Remove last message ("Thinking...")
        return [...newMessages, { text: data.answer, sender: 'bot' }];
      });
      inputValueRef.current?.focus(); // Focus the input after successful message sending
    },
    onError: (error) => {
      setMessages(prev => {
        // Remove "Thinking..." and add an error message
        const newMessages = prev.slice(0, prev.length - 1);
        return [...newMessages, { text: `Error: ${error.message}`, sender: 'bot' }];
      });
      inputValueRef.current?.focus(); // Focus the input after an error
    },
  });

  const handleSendMessage = () => {
    if (inputValue.trim() === '' || sendMessageMutation.isPending) return;

    const payload = {
      message: inputValue,
      conversationHistory: messages.map(msg => ({ sender: msg.sender, text: msg.text })),
    };
    sendMessageMutation.mutate(payload);
  };

  useEffect(() => {
    if (isSuccess && initialMessageData && messages.length === 0) {
      setMessages([{ text: initialMessageData.message, sender: 'bot' }]);
    }
  }, [isSuccess, initialMessageData, messages.length]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, sendMessageMutation.isPending]);


  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="container mx-auto flex h-[calc(100vh-4rem)] flex-col bg-gray-50 dark:bg-gray-900">
      <div className="flex justify-end p-4 bg-gray-50 dark:bg-gray-900">
        <Link href="/student/dashboard" legacyBehavior>
          <a className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
            Back to Dashboard
          </a>
        </Link>
      </div>
      
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.length === 0 && !sendMessageMutation.isPending ? (
             <div className="text-center text-gray-500 dark:text-gray-400">
               Chat messages will appear here. Start by typing a message below.
             </div>
          ) : (
            messages.map((message, index) => (
              <div key={index} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-lg rounded-lg px-4 py-2 ${message.sender === 'user' ? 'bg-purple-600 text-white' : 'bg-white text-black dark:bg-gray-700 dark:text-white shadow-sm'}`}>
                  {message.text}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      <div className="border-t bg-white dark:bg-gray-800 dark:border-gray-700 p-4">
        <div className="flex items-center space-x-2">
          <input
            ref={inputValueRef}
            type="text"
            placeholder="Ask a question about the course..."
            className="flex-1 rounded-md border border-gray-300 p-2 focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={sendMessageMutation.isPending}
          />
          <button
            className="rounded-md bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 disabled:bg-gray-400"
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || sendMessageMutation.isPending}
          >
            {sendMessageMutation.isPending ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
