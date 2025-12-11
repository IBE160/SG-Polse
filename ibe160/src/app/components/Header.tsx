"use client";

import Link from "next/link";
import { useTheme } from "next-themes";

export function Header() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="border-b bg-white dark:bg-gray-800 dark:border-gray-700 p-4 shadow-sm flex items-center justify-between">
      <Link href="/student/dashboard">
        <h1 className="text-2xl font-bold dark:text-white">IBE400 Machine Learning Chatbot</h1>
      </Link>
      <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
      >
        {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
      </button>
    </header>
  );
}
