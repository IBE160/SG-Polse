'use client';

import React, { useState } from 'react';
import courseData from '../../../__mocks__/course-data.json';

interface Message {
  text: string;
  isUser: boolean;
}

export default function StudentDashboardPage() {
  const [messages, setMessages] = useState<Message[]>([
    { text: 'Hello! Ask me anything about IBE160.', isUser: false },
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;

    const newMessages: Message[] = [...messages, { text: inputValue, isUser: true }];
    setMessages(newMessages);
    setInputValue('');

    setTimeout(() => {
      const botResponse = getBotResponse(inputValue);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: botResponse, isUser: false },
      ]);
    }, 1000);
  };

  const getBotResponse = (userInput: string): string => {
    const lowerCaseInput = userInput.toLowerCase();

    if (lowerCaseInput.includes('assignment')) {
      return `Here are the upcoming assignments: ${courseData.assignments
        .map((a) => `${a.title} (due: ${a.dueDate})`)
        .join(', ')}`;
    }

    if (lowerCaseInput.includes('info')) {
      return courseData.courseInfo;
    }
    
    if (lowerCaseInput.includes('syllabus')) {
        return courseData.syllabus;
    }

    if (lowerCaseInput.includes('deadline')) {
        const assignment = courseData.assignments.find(a => lowerCaseInput.includes(a.title.toLowerCase()));
        if(assignment){
            return `The deadline for ${assignment.title} is ${assignment.dueDate}.`;
        }
        return "Which assignment are you asking about?";
    }

    return "I'm sorry, I don't understand that. You can ask me about 'assignments', 'info', 'syllabus', or 'deadline' for a specific assignment.";
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-xl font-bold">IBE160 Chatbot</h1>
      </header>

      <main className="flex-1 p-4 overflow-y-auto">
        <div className="flex flex-col space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`${
                  message.isUser
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200'
                } rounded-lg p-3 max-w-xs`}
              >
                <p>{message.text}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="p-4 bg-white border-t">
        <div className="flex items-center">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSendMessage}
            className="ml-2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Send
          </button>
        </div>
      </footer>
    </div>
  );
}