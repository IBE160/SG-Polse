import { NextResponse } from "next/server";
import { auth } from "~/server/auth/edge";
import { type NextRequest } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;
  const session = req.auth;

  const isLoggedIn = !!session;

  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
  const isTRPCRoute = nextUrl.pathname.startsWith("/api/trpc");
  const isPublicRoute = ["/"].includes(nextUrl.pathname);


  if (isApiAuthRoute || isTRPCRoute || isPublicRoute) {
    return NextResponse.next();
  }

  if (isLoggedIn) {
    const userRole = session?.user?.role;
    const isTeacherDashboard = nextUrl.pathname.startsWith("/teacher");
    const isStudentDashboard = nextUrl.pathname.startsWith("/student");

    // If logged in and at the root, redirect to the correct dashboard
    if (nextUrl.pathname === "/") {
      if (userRole === "TEACHER") {
        return NextResponse.redirect(new URL("/teacher/dashboard", nextUrl));
      } else {
        return NextResponse.redirect(new URL("/student/dashboard", nextUrl));
      }
    }

    if (isTeacherDashboard && userRole !== "TEACHER") {
      return NextResponse.redirect(new URL("/student/dashboard", nextUrl));
    }

    if (isStudentDashboard && userRole !== "STUDENT") {
      return NextResponse.redirect(new URL("/teacher/dashboard", nextUrl));
    }

    return NextResponse.next();
  }

  // Redirect to login if not logged in and trying to access a protected route
  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL("/", nextUrl));
  }


  return NextResponse.next();
});

// Optionally, don't invoke Middleware on some paths
// Read more: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: ["/((?!api|trpc|.+\\.[\\w]+$|_next).*)", "/"],
};
