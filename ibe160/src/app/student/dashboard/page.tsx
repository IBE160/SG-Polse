"use client"
import React from 'react';
import Link from 'next/link';

const StudentDashboardPage = () => {
  // Mock data for enrolled courses. In a real app, this would come from an API call.
  const courses = [
    { id: 'ibe400', name: 'IBE400 - Machine Learning' },
    // Example of another course for UI testing:
    // { id: 'fin201', name: 'FIN201 - Corporate Finance' },
  ];

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="container mx-auto max-w-4xl py-8 bg-gray-50 dark:bg-gray-900">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold dark:text-white">My Courses</h1>
          <Link href="/upload" legacyBehavior>
            <a className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Upload Document
            </a>
          </Link>
        </div>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Select a course to start a chat session.</p>

        <div className="mt-8 space-y-4">
          {courses.map((course) => (
            <Link key={course.id} href={`/student/chat/${course.id}`} legacyBehavior>
              <a className="block rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 ease-in-out hover:border-purple-300 hover:shadow-lg dark:bg-gray-800 dark:border-gray-700 dark:hover:border-purple-500">
                <h2 className="text-xl font-semibold text-purple-700 dark:text-purple-400">{course.name}</h2>
                <p className="mt-1 text-gray-500 dark:text-gray-400">Click to open the course chatbot and ask questions.</p>
              </a>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboardPage;
