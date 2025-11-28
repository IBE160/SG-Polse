# Story 1.4: User Login with OAuth 2.0

Status: ready-for-dev

## Story

As a registered user,
I want to log in to the chatbot using OAuth 2.0 with my school credentials,
so that I can securely access my account.

## Acceptance Criteria

1. User can access a login page.
2. User can initiate OAuth 2.0 flow with the school's identity provider.
3. Successful authentication redirects the user to the application dashboard.
4. Failed authentication displays an appropriate error message on the login page.

## Tasks / Subtasks

- [ ] **Backend (NextAuth.js)**
  - [ ] Configure `NextAuth.js` to use an OAuth provider (e.g., Google, Azure AD, or a generic OAuth 2.0 provider). (AC: #2)
  - [ ] Implement the `signIn` and `callback` logic for the OAuth provider. (AC: #2)
  - [ ] Ensure that the user's profile information from the provider is correctly mapped to the `User` model in the database.
  - [ ] Add subtask for testing the OAuth login flow.
- [ ] **Frontend (UI)**
  - [ ] Create a login page at `/auth/login` if it doesn't already exist. (AC: #1)
  - [ ] Add a "Login with School Account" button to the login page. (AC: #2)
  - [ ] Implement the logic to initiate the `NextAuth.js` OAuth flow when the button is clicked.
  - [ ] Ensure the user is redirected to the dashboard on successful login. (AC: #3)
  - [ ] Display an error message if the OAuth flow fails or is cancelled. (AC: #4)
  - [ ] Add subtask for testing the login page UI and interactions.

## Dev Notes

### Learnings from Previous Story
*   Previous stories set up user registration and email verification. This story provides the primary way for verified users to log in.

### Relevant architecture patterns and constraints
*   **Authentication:** This story is the core implementation of the `NextAuth.js` OAuth flow. The specific provider will need to be configured based on the school's identity provider.
*   **Database:** The `User` model should already be in place. The `NextAuth.js` adapter for Prisma will handle the creation or linking of user accounts.
*   **API:** Most of the logic will be handled by `NextAuth.js` pages and callbacks, not custom tRPC procedures.

### Project Structure Notes
*   The `NextAuth.js` configuration is located at `src/server/auth.ts`.
*   The login page should be created at `src/app/auth/login`.

### References
*   [Source: docs/epics.md#Epic-1]
*   [Source: docs/PRD.md#FR001]
*   [Source: docs/architecture.md#Authentication]

## Dev Agent Record

### Context Reference
- docs/sprint-artifacts/1-4-user-login-with-oauth-2-0.context.xml

### Agent Model Used
{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List

## Change Log
- 2025-11-28: Initial draft created.
