import React from 'react';
import Link from 'next/link';

const StudentDashboardPage = () => {
  // Mock data for enrolled courses. In a real app, this would come from an API call.
  const courses = [
    { id: 'ibe160', name: 'IBE160 - Introduction to Business Engineering' },
    // Example of another course for UI testing:
    // { id: 'fin201', name: 'FIN201 - Corporate Finance' },
  ];

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <h1 className="text-3xl font-bold">My Courses</h1>
      <p className="mt-2 text-lg text-gray-600">Select a course to start a chat session.</p>

      <div className="mt-8 space-y-4">
        {courses.map((course) => (
          <Link key={course.id} href={`/student/chat/${course.id}`} legacyBehavior>
            <a className="block rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 ease-in-out hover:border-purple-300 hover:shadow-lg">
              <h2 className="text-xl font-semibold text-purple-700">{course.name}</h2>
              <p className="mt-1 text-gray-500">Click to open the course chatbot and ask questions.</p>
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default StudentDashboardPage;
