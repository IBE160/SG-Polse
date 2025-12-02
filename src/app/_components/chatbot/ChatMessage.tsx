// src/app/_components/chatbot/ChatMessage.tsx
import React from 'react';
import { ChatMessage as ChatMessageType } from '~/lib/types/chat';

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  const messageClasses = isUser
    ? 'bg-purple-600 text-white self-end'
    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 self-start';
  const containerClasses = isUser ? 'justify-end' : 'justify-start';

  if (message.isLoading) {
    return (
      <div className={`flex ${containerClasses} mb-2`}>
        <div className={`${messageClasses} p-3 rounded-lg max-w-xs shadow-md`}>
          <div className="flex space-x-1">
            <span className="sr-only">Loading...</span>
            <div className="h-2 w-2 bg-white dark:bg-gray-300 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="h-2 w-2 bg-white dark:bg-gray-300 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="h-2 w-2 bg-white dark:bg-gray-300 rounded-full animate-bounce"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${containerClasses} mb-2`}>
      <div className={`${messageClasses} p-3 rounded-lg max-w-xs shadow-md`}>
        <p className="whitespace-pre-wrap">{message.text}</p>
        {message.teacherContactInfo && (
          <div className="mt-2 text-sm opacity-90">
            <p><strong>Contact Teacher:</strong></p>
            <p>Method: {message.teacherContactInfo.method}</p>
            <p>Details: {message.teacherContactInfo.details}</p>
          </div>
        )}
        {message.sources && message.sources.length > 0 && (
          <div className="mt-2 text-xs opacity-75">
            <strong>Sources:</strong>
            <ul className="list-disc list-inside">
              {message.sources.map((src, index) => (
                <li key={index}>
                  {src.documentName}
                  {src.pageNumber && `, Page ${src.pageNumber}`}
                  {src.url && (
                    <>
                      {" "}
                      (<a href={src.url} target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:underline">{new URL(src.url).hostname}</a>)
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
        {message.isError && (
          <p className="mt-2 text-sm font-semibold text-red-500">Error processing message.</p>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;