# Story 1.2: User Registration with School Email

Status: ready-for-dev

## Story

As a new user,
I want to register for the chatbot using my school email and password,
so that I can create an account linked to my academic institution.

## Acceptance Criteria

1. User can access a registration page.
2. User can input school email and password.
3. System sends a verification email to the provided school email address using the Resend service.
4. User receives a confirmation of successful registration on the UI.

## Tasks / Subtasks

- [ ] **Backend (API)**
  - [ ] Create a new tRPC procedure for user registration (AC: #2)
  - [ ] Add input validation for email and password fields.
  - [ ] Implement logic to create a new `User` record in the database using Prisma.
  - [ ] Integrate the `Resend` email service to send a verification email (AC: #3)
  - [ ] Add subtask for testing the registration procedure.
- [ ] **Frontend (UI)**
  - [ ] Create a new registration page/component at `/auth/register` (AC: #1)
  - [ ] Build the registration form with email and password fields.
  - [ ] Implement client-side validation for the form.
  - [ ] Call the tRPC registration procedure on form submission.
  - [ ] Display a success message upon successful registration (AC: #4)
  - [ ] Display any errors returned from the API.
  - [ ] Add subtask for testing the registration form UI and interactions.
- [ ] **Database**
  - [ ] Update the `schema.prisma` file to include necessary fields on the `User` model (e.g., `email`, `passwordHash`, `emailVerified`).
  - [ ] Generate and apply the database migration. (AC: #2)

## Dev Notes

### Learnings from Previous Story
*   Previous story (`1-1-...`) is drafted but not yet implemented. It establishes the T3 project structure which this story will build upon.

### Relevant architecture patterns and constraints
*   **Authentication:** Use `NextAuth.js` with the `CredentialsProvider`. The registration logic will be custom, but it should integrate with the existing NextAuth setup.
*   **Database:** Use the initialized `PrismaClient` to interact with the `User` table.
*   **API:** All backend logic must be exposed via `tRPC` procedures.
*   **Email:** Use the `Resend` email service as defined in the architecture.

### Project Structure Notes
*   The registration page should be created within the `src/app/auth/` directory structure.
*   The new tRPC router for auth should be in `src/server/api/routers/auth.ts`.
*   The Prisma schema is located at `prisma/schema.prisma`.

### References
*   [Source: docs/epics.md#Epic-1]
*   [Source: docs/PRD.md#FR001]
*   [Source: docs/architecture.md#Authentication]
*   [Source: docs/architecture.md#API-Communication]
*   [Source: docs/architecture.md#Email-Service]

## Dev Agent Record

### Context Reference
- docs/sprint-artifacts/1-2-user-registration-with-school-email.context.xml

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List

## Change Log
- 2025-11-28: Initial draft created.
