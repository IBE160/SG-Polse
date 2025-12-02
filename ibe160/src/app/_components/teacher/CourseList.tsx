"use client";

import { api } from "~/utils/api";
import Link from "next/link";

export function CourseList() {
  const { data: courses, isLoading, error } = api.teacher.getTeacherCourses.useQuery();

  if (isLoading) {
    return <div>Loading courses...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!courses || courses.length === 0) {
    return <div>You are not assigned to any courses.</div>;
  }

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-semibold">Your Courses</h2>
      <ul className="mt-4 space-y-4">
        {courses.map((course) => (
          <li key={course.id} className="border p-4 rounded-lg hover:bg-gray-100">
            <Link href={`/teacher/course/${course.id}/manage`}>
              <span className="text-xl font-medium">{course.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
