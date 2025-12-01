# Story 1.5: Role-Based Access Control (Student/Teacher)

Status: review

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

- [x] **Backend (API & Auth)**
  - [x] Add a `role` field (e.g., an enum with 'STUDENT' and 'TEACHER' values) to the `User` model in `schema.prisma`. (AC: #1)
  - [x] Generate and apply the database migration.
  - [x] Modify the `NextAuth.js` session callback to include the user's role in the session object. (AC: #1)
  - [x] Create middleware to protect routes based on user role. (AC: #4)
  - [ ] **BLOCKED** - Write integration test to verify the session contains the user role.
  - [ ] **BLOCKED** - Write integration test for the middleware to ensure it correctly protects routes.
- [x] **Frontend (UI)**
  - [x] Implement a redirect mechanism after login that directs users to the correct page based on their role from the session. (AC: #2, #3)
  - [x] Create a placeholder page for the student dashboard (course selection view).
  - [x] Create a placeholder page for the teacher dashboard (course management view).
  - [ ] **BLOCKED** - Write an end-to-end test for the login redirect logic.

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
- The test runner is currently broken, preventing automated tests from being written and executed. The Jest configuration seems to have issues with ES Modules and module mapping. This needs to be addressed separately.

### Completion Notes List
- Implemented Role-Based Access Control.
- Added `role` to `User` model in `schema.prisma`.
- Created middleware to protect routes based on role.
- Created placeholder dashboard pages for student and teacher roles.
- Configured NextAuth.js to include the user's role in the session.
- **Note:** All implementation tasks are complete. The story is blocked from being marked 'done' due to the inability to run tests.

### File List
- `ibe160/prisma/schema.prisma` (modified)
- `ibe160/src/server/auth/config.ts` (modified)
- `ibe160/src/middleware.ts` (created)
- `ibe160/src/server/auth/index.ts` (created)
- `ibe160/src/app/student/dashboard/page.tsx` (created)
- `ibe160/src/app/teacher/dashboard/page.tsx` (created)
- `docs/sprint-artifacts/1-5-role-based-access-control-student-teacher.md` (modified)
- `docs/sprint-artifacts/sprint-status.yaml` (modified)
- `ibe160/src/server/api/routers/auth.ts` (modified)
- `ibe160/src/server/api/routers/auth.test.ts` (modified)
- `ibe160/src/app/auth/login/page.test.tsx` (modified)
- `ibe160/jest.config.cjs` (modified)
- `ibe160/jest.setup.js` (created)

## Change Log
- 2025-11-28: Initial draft created.
- 2025-12-01: Implemented RBAC, added role to user model, created middleware and dashboard pages. Blocked by broken test runner.

---
## Senior Developer Review (AI)
- **Reviewer:** BIP
- **Date:** 2025-12-01
- **Outcome:** **Blocked**
  - **Justification:** The story is blocked due to a complete lack of automated tests for the authentication and authorization logic. This is a high-severity issue that prevents approval.

### Summary
The implementation of Role-Based Access Control is functionally complete based on a manual code review. The user `role` is correctly added to the database schema and propagated to the session, and the middleware is effective at protecting routes. However, the story is blocked by the critical absence of tests, which is a known issue due to a broken test runner. Additionally, there's a minor deviation in the post-login redirect logic that should be addressed.

### Key Findings
- **[High] Critical Test Coverage Gap:** No automated tests (unit, integration, or E2E) have been provided. The developer's notes correctly identify this is due to a broken test runner. As a result, critical security and functionality logic (authorization, redirection) is unverified by automated means.
- **[Medium] Post-Login Redirect Logic:** The redirect mechanism in `middleware.ts` only triggers when an already logged-in user visits the root path (`/`). The expected behavior is an immediate redirect to the appropriate dashboard right after the authentication callback completes.

### Acceptance Criteria Coverage

| AC# | Description | Status | Evidence |
|---|---|---|---|
| 1 | System identifies user's role upon login. | IMPLEMENTED | `schema.prisma` contains `role` on `User` model. `src/server/auth/config.ts` session callback adds role to session. |
| 2 | Students directed to course selection view after login. | PARTIAL | `src/middleware.ts` redirects logged-in students from `/` to `/student/dashboard`. Redirect is not immediate post-login. |
| 3 | Teachers directed to course management view after login. | PARTIAL | `src/middleware.ts` redirects logged-in teachers from `/` to `/teacher/dashboard`. Redirect is not immediate post-login. |
| 4 | Unauthorized access to role-specific pages is prevented. | IMPLEMENTED | `src/middleware.ts` correctly redirects users with mismatched roles (e.g., student accessing `/teacher`). |

### Task Completion Validation

| Task | Marked As | Verified As | Evidence |
|---|---|---|---|
| Add `role` field to `User` model | `[x]` | VERIFIED COMPLETE | `ibe160/prisma/schema.prisma` |
| Generate and apply DB migration | `[x]` | NOT VERIFIABLE | Assumed complete. Cannot inspect database state. |
| Modify `NextAuth.js` session callback | `[x]` | VERIFIED COMPLETE | `ibe160/src/server/auth/config.ts` |
| Create middleware to protect routes | `[x]` | VERIFIED COMPLETE | `ibe160/src/middleware.ts` |
| Implement redirect mechanism after login | `[x]` | PARTIALLY VERIFIED | `ibe160/src/middleware.ts`. Logic differs from expectation. |
| Create student dashboard placeholder | `[x]` | VERIFIED COMPLETE | `ibe160/src/app/student/dashboard/page.tsx` |
| Create teacher dashboard placeholder | `[x]` | VERIFIED COMPLETE | `ibe160/src/app/teacher/dashboard/page.tsx` |
| Write integration test for session role | `[ ]` | NOT DONE | Blocked by test runner issues. |
| Write integration test for middleware | `[ ]` | NOT DONE | Blocked by test runner issues. |
| Write E2E test for redirect logic | `[ ]` | NOT DONE | Blocked by test runner issues. |

### Test Coverage and Gaps
There is currently **zero** automated test coverage for this story. While the developer's notes indicate efforts were made to fix the test runner, the absence of tests for critical authentication and authorization logic is a significant gap that must be filled before this story can be considered 'done'.

### Architectural Alignment
The implementation is well-aligned with the T3 architecture defined in `architecture.md`. It correctly uses NextAuth.js, Prisma, and Next.js middleware as intended by the documented patterns.

### Action Items

**Code Changes Required:**
- [ ] **[High]** Resolve the Jest test runner issues and implement a suite of tests covering the authentication and authorization flow.
- [ ] **[High]** Write an integration test to verify the user `role` is present in the NextAuth.js session object. (AC #1)
- [ ] **[High]** Write integration tests for the middleware to verify that unauthorized users are correctly redirected. (AC #4)
- [ ] **[Medium]** Refactor the post-login redirect logic to occur immediately after the authentication callback, rather than upon a subsequent visit to the root page. (AC #2, #3)

**Advisory Notes:**
- **Note:** In `middleware.ts`, consider explicitly making the login page route public if it is not the root (`/`) page to avoid accidental blocking in the future.
