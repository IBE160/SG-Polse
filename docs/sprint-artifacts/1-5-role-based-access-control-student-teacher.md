# Story 1.5: Role-Based Access Control (Student/Teacher)

Status: ready-for-dev

## Story

As an authenticated user,
I want the system to recognize my role (student or teacher),
so that I am granted appropriate access and permissions within the application.

## Acceptance Criteria

1. The system identifies the user's role (e.g., 'student' or 'teacher') upon successful login.
2. Students are directed to the course selection view after login.
3. Teachers are directed to their course management/upload view after login.
4. Unauthorized access to role-specific pages is prevented (e.g., a student cannot access the teacher dashboard).

## Tasks / Subtasks

- [ ] **Backend (API & Auth)**
  - [ ] Add a `role` field (e.g., an enum with 'STUDENT' and 'TEACHER' values) to the `User` model in `schema.prisma`. (AC: #1)
  - [ ] Generate and apply the database migration.
  - [ ] Modify the `NextAuth.js` session callback to include the user's role in the session object. (AC: #1)
  - [ ] Create middleware to protect routes based on user role. (AC: #4)
  - [ ] Add subtask for testing that the session contains the user role and that middleware correctly protects routes.
- [ ] **Frontend (UI)**
  - [ ] Implement a redirect mechanism after login that directs users to the correct page based on their role from the session. (AC: #2, #3)
  - [ ] Create a placeholder page for the student dashboard (course selection view).
  - [ ] Create a placeholder page for the teacher dashboard (course management view).
  - [ ] Add subtask for testing the redirect logic.

## Dev Notes

### Learnings from Previous Story
*   Previous stories established the authentication flow. This story builds on that by adding authorization and role-based routing.

### Relevant architecture patterns and constraints
*   **Authorization:** The user's role should be the single source of truth for authorization. This should be managed in the database and propagated to the `NextAuth.js` session.
*   **Route Protection:** Use Next.js Middleware to check the user's session and role before allowing access to protected pages.
*   **Database:** The `User` model will need a new `role` field. A default role of 'STUDENT' can be assigned on registration.

### Project Structure Notes
*   Middleware should be implemented in a `middleware.ts` file at the root of the `src` directory.
*   The placeholder dashboards can be created at `/student/dashboard` and `/teacher/dashboard`.

### References
*   [Source: docs/epics.md#Epic-1]
*   [Source: docs/PRD.md#FR002]
*   [Source: docs/PRD.md#FR003]
*   [Source: docs/architecture.md#Authentication]

## Dev Agent Record

### Context Reference
- docs/sprint-artifacts/1-5-role-based-access-control-student-teacher.context.xml

### Agent Model Used
{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List

## Change Log
- 2025-11-28: Initial draft created.
