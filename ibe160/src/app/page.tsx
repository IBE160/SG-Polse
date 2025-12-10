import { redirect } from "next/navigation";
import { auth } from "~/server/auth";

export default async function Home() {
  const session = await auth();

  if (session) {
    // User is authenticated, redirect to their dashboard
    // TODO: Implement logic to redirect to teacher vs student dashboard based on role
    redirect('/student/dashboard');
  } else {
    // User is not authenticated, redirect to the login page
    redirect('/auth/login');
  }

  // This part will not be reached due to the redirects,
  // but it's good practice to have a fallback.
  return null;
}
