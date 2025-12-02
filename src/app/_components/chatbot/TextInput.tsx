// src/app/_components/chatbot/TextInput.tsx
import React from 'react';

interface TextInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean; // To disable input/button when bot is processing
}

const TextInput: React.FC<TextInputProps> = ({ onSendMessage, isLoading }) => {
  const [message, setMessage] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={isLoading ? 'Thinking...' : 'Type your question...'}
        className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        disabled={isLoading}
      />
      <button
        type="submit"
        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isLoading}
      >
        {isLoading ? (
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l4.415-1.189a1 1 0 00.758-.042l5.517-4.138a1 1 0 000-1.559l-5.517-4.138a1 1 0 00-.758-.042L4.925 17.962a1 1 0 00-1.169 1.409l7-14z"></path>
          </svg>
        )}
      </button>
    </form>
  );
};

export default TextInput;