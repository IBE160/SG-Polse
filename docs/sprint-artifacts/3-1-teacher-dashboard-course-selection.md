# Story 3.1: Teacher Dashboard & Course Selection

Status: ready-for-dev

## Story

As a teacher,
I want to access a dashboard that lists the courses I teach,
so that I can select the course for which I want to manage content.

## Acceptance Criteria

1. Authenticated teachers are directed to a dashboard displaying their assigned courses.
2. The teacher can select a specific course from the list.
3. Only courses assigned to the teacher are visible.

## Tasks / Subtasks

- [ ] **Backend (API)**
  - [ ] Create a tRPC procedure to fetch the list of courses assigned to the currently authenticated teacher. (AC: #1, #3)
  - [ ] This will require a relation in the database between `User` and `Course` models.
  - [ ] Add subtask for testing the procedure.
- [ ] **Frontend (UI)**
  - [ ] Create a teacher dashboard page at `/teacher/dashboard`. (AC: #1)
  - [ ] On this page, call the tRPC procedure to fetch and display the list of courses. (AC: #1)
  - [ ] Implement a UI component to display the list of courses. (AC: #2)
  - [ ] Clicking on a course should navigate to the content management page for that course (to be created in the next story). (AC: #2)
  - [ ] Add subtask for testing the dashboard UI.
- [ ] **Database**
  - [ ] Update the `schema.prisma` file to create a `Course` model and establish a many-to-many or one-to-many relationship between `User` (teachers) and `Course`.

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

### Completion Notes List

### File List

## Change Log
- 2025-11-28: Initial draft created.
