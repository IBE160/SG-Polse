// src/app/teacher/course/[courseId]/page.tsx
import { api } from '~/utils/api';
import { FileUpload } from '~/app/_components/teacher/FileUpload'; // Import FileUpload component

interface CourseContentManagementPageProps {
  params: {
    courseId: string;
  };
}

export default function CourseContentManagementPage({ params }: CourseContentManagementPageProps) {
  const { courseId } = params;

  // Placeholder for fetching course details and files
  // This will be implemented in a later step
  const { data: courses, isLoading, error } = api.teacher.getTeacherCourses.useQuery();

  if (isLoading) {
    return <div className="container mx-auto p-4">Loading course details...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">Error loading course: {error.message}</div>;
  }

  // Find the specific course from the fetched list
  const selectedCourse = courses?.find((c) => c.id === courseId);

  if (!selectedCourse) {
    notFound(); // If course not found or not assigned to teacher
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Content Management for {selectedCourse.name}</h1>
      <p className="mb-6">Manage documents for this course.</p>

      <FileUpload courseId={courseId} />
    </div>
  );
}
