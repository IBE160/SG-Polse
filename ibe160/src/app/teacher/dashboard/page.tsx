import { getServerAuthSession } from "~/server/auth";
import { redirect } from "next/navigation";
import { CourseList } from "~/app/_components/teacher/CourseList";

const TeacherDashboardPage = async () => {
  const session = await getServerAuthSession();

  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  if (session.user.role !== "TEACHER") {
    // Or redirect to a generic "unauthorized" page
    redirect("/"); 
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
      <p className="mt-4">Welcome, {session.user.name}. Here you can manage your courses and content.</p>
      <CourseList />
    </div>
  );
};

export default TeacherDashboardPage;

