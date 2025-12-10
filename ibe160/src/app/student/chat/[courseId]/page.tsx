"use client";

import React, { useState, useEffect, useRef, use } from 'react';
import { api } from '~/utils/api';

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

const ChatPage = ({ params }: { params: { courseId: string } }) => {
  const { courseId } = use(params);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);

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
    },
    onError: (error) => {
      setMessages(prev => {
        // Remove "Thinking..." and add an error message
        const newMessages = prev.slice(0, prev.length - 1);
        return [...newMessages, { text: `Error: ${error.message}`, sender: 'bot' }];
      });
    },
  });

  const handleSendMessage = () => {
    if (inputValue.trim() === '' || sendMessageMutation.isPending) return;

    const payload = {
      message: inputValue,
      conversationHistory: messages.map(msg => ({ sender: msg.sender, text: msg.text })),
    };
    console.log('Frontend sending payload:', payload); // <--- ADD THIS

    sendMessageMutation.mutate(payload);
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, sendMessageMutation.isPending]);


  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="container mx-auto flex h-[calc(100vh-4rem)] flex-col bg-gray-50">
      <div className="border-b bg-white p-4 shadow-sm">
        <h1 className="text-2xl font-bold">Chat for Course: {courseId}</h1>
      </div>
      
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.length === 0 && !sendMessageMutation.isPending ? (
             <div className="text-center text-gray-500">
               Chat messages will appear here. Start by typing a message below.
             </div>
          ) : (
            messages.map((message, index) => (
              <div key={index} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-lg rounded-lg px-4 py-2 ${message.sender === 'user' ? 'bg-purple-600 text-white' : 'bg-white text-black shadow-sm'}`}>
                  {message.text}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      <div className="border-t bg-white p-4">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Ask a question about the course..."
            className="flex-1 rounded-md border border-gray-300 p-2 focus:border-purple-500 focus:ring-purple-500"
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
