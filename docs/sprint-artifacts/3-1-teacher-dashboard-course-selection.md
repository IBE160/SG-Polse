# Story 3.1: Teacher Dashboard & Course Selection

Status: in-progress

## Story

As a teacher,
I want to access a dashboard that lists the courses I teach,
so that I can select the course for which I want to manage content.

## Acceptance Criteria

1. Authenticated teachers are directed to a dashboard displaying their assigned courses.
2. The teacher can select a specific course from the list.
3. Only courses assigned to the teacher are visible.

## Tasks / Subtasks

- [x] **Backend (API)**
  - [x] Create a tRPC procedure to fetch the list of courses assigned to the currently authenticated teacher. (AC: #1, #3)
  - [x] This will require a relation in the database between `User` and `Course` models.
  - [x] Add subtask for testing the procedure.
- [x] **Frontend (UI)**
  - [x] Create a teacher dashboard page at `/teacher/dashboard`. (AC: #1)
  - [x] On this page, call the tRPC procedure to fetch and display the list of courses. (AC: #1)
  - [x] Implement a UI component to display the list of courses. (AC: #2)
  - [x] Clicking on a course should navigate to the content management page for that course (to be created in the next story). (AC: #2)
  - [x] Add subtask for testing the dashboard UI.
- [x] **Database**
  - [x] Update the `schema.prisma` file to create a `Course` model and establish a many-to-many or one-to-many relationship between `User` (teachers) and `Course`.

## Dev Notes

### Learnings from Previous Story
*   This is the first story for Epic 3, which focuses on teacher-specific functionality. It builds on the role-based access control from Epic 1.

### Relevant architecture patterns and constraints
*   **Authorization:** The tRPC procedure must be protected to ensure that only users with the 'TEACHER' role can access it.
*   **Data Model:** The relationship between users and courses is a key part of the data model that will be implemented in this story.

### Project Structure Notes
*   The teacher dashboard will be at `/teacher/dashboard`.
*   The new tRPC router for teacher-related functionality could be in `src/server/api/routers/teacher.ts`.

### References
*   [Source: docs/epics.md#Epic-3]

## Dev Agent Record

### Context Reference
- docs/sprint-artifacts/3-1-teacher-dashboard-course-selection.context.xml

### Agent Model Used
{{agent_model_name_version}}

### Debug Log References
- [x] Implemented Course and User relations in `prisma/schema.prisma`.
- [x] Created `src/server/api/routers/teacher.ts` with `getTeacherCourses` tRPC procedure.
- [x] Integrated `teacherRouter` into `src/server/api/root.ts`.
- [x] Created `src/app/_components/teacher/CourseList.tsx` component.
- [x] Updated `src/app/teacher/dashboard/page.tsx` to use `CourseList` and enforce teacher authentication.
- [x] Created `src/server/api/routers/teacher.test.ts` for backend API.
- [x] Created `src/app/_components/teacher/CourseList.test.tsx` for frontend component.

### Completion Notes List
- All core tasks for the story have been implemented.
- Database schema updated and migration applied.
- Backend API for fetching teacher courses is implemented and protected.
- Frontend dashboard page and course listing component are implemented.
- New unit/integration tests for both backend and frontend components were written.
- Note: Existing client-side test failures in `src/app/auth/verify/page.test.tsx` and `src/app/auth/login/page.test.tsx` were observed but deemed outside the scope of this story's direct implementation and are logged as technical debt.

### File List
- `ibe160/prisma/schema.prisma` (modified)
- `ibe160/src/server/api/trpc.ts` (modified)
- `ibe160/src/server/api/routers/teacher.ts` (new)
- `ibe160/src/server/api/root.ts` (modified)
- `ibe160/src/app/_components/teacher/CourseList.tsx` (new)
- `ibe160/src/app/teacher/dashboard/page.tsx` (modified)
- `ibe160/jest.setup.cjs` (modified - prisma mock)
- `ibe160/__mocks__/utils/api.ts` (modified - trpc react mock)
- `ibe160/src/server/api/routers/teacher.test.ts` (new)
- `ibe160/src/app/_components/teacher/CourseList.test.tsx` (new)
- `ibe160/jest.config.cjs` (modified - moduleNameMapper)
- `ibe160/__mocks__/trpc/react.ts` (deleted)

## Change Log
- 2025-11-28: Initial draft created.
- 2025-12-02: Implemented database schema changes, backend tRPC procedure, and frontend UI components for teacher dashboard. Added corresponding tests.