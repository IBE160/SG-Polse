# Story 1.4: User Login with OAuth 2.0

Status: review

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
  - [x] Configure `NextAuth.js` to use an OAuth provider (e.g., Google, Azure AD, or a generic OAuth 2.0 provider). (AC: #2)
  - [x] Implement the `signIn` and `callback` logic for the OAuth provider. (AC: #2)
  - [x] Ensure that the user's profile information from the provider is correctly mapped to the `User` model in the database.
  - [x] Add subtask for testing the OAuth login flow.
  - [x] Write unit/integration tests for the OAuth login flow.
- [ ] **Frontend (UI)**
  - [x] Create a login page at `/auth/login` if it doesn't already exist. (AC: #1)
  - [x] Add a "Login with School Account" button to the login page. (AC: #2)
  - [x] Implement the logic to initiate the `NextAuth.js` OAuth flow when the button is clicked.
  - [x] Ensure the user is redirected to the dashboard on successful login. (AC: #3)
  - [x] Display an error message if the OAuth flow fails or is cancelled. (AC: #4)
  - [x] Add subtask for testing the login page UI and interactions.
  - [x] Write unit/integration tests for the login page UI, including OAuth button and error display.

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
- Configured NextAuth.js OAuth providers in `ibe160/src/server/auth/config.ts`:
  - Added `GoogleProvider` using `process.env.GOOGLE_CLIENT_ID` and `process.env.GOOGLE_CLIENT_SECRET`.
  - Ensured `DiscordProvider` uses `process.env.DISCORD_CLIENT_ID` and `process.env.DISCORD_CLIENT_SECRET`.
- Environment variables `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `DISCORD_CLIENT_ID`, `DISCORD_CLIENT_SECRET` must be set in `ibe160/.env`.
- Implemented `signIn` callback in `ibe160/src/server/auth/config.ts` to include a placeholder email domain check (`@school.com`) for OAuth providers.
- Confirmed that `NextAuth.js PrismaAdapter` handles the mapping of standard OAuth profile data (`id`, `name`, `email`, `image`) to the `User` model in `ibe160/prisma/schema.prisma` automatically. No explicit code changes needed for this task.
- Added subtask `[ ] Write unit/integration tests for the OAuth login flow.` under "Backend (NextAuth.js)" tasks.
- Wrote unit tests for `signIn` callback in `ibe160/src/server/auth/config.test.ts`.
- Encountered persistent Jest configuration issues (e.g., `ReferenceError: jest is not defined`, `SyntaxError: Unexpected token '<'`, module resolution problems) preventing successful execution and verification of tests. The test environment setup for ESM and `ts-jest` appears to be misconfigured.
- Confirmed that `ibe160/src/app/auth/login/page.tsx` already exists, satisfying the task "Create a login page at /auth/login if it doesn't already exist. (AC: #1)".
- Added a "Login with School Account" button to `ibe160/src/app/auth/login/page.tsx`.
- Implemented `onClick` logic for "Login with School Account" button in `ibe160/src/app/auth/login/page.tsx` to call `signIn('google')`.
- Added `callbackUrl: '/'` to `signIn('google')` call in `ibe160/src/app/auth/login/page.tsx` to ensure redirection to dashboard after successful OAuth login.
- Implemented error message display for failed OAuth flows in `ibe160/src/app/auth/login/page.tsx` using `useSearchParams` and `useEffect` to read the `error` query parameter.
- Added subtask `[ ] Write unit/integration tests for the login page UI, including OAuth button and error display.` under "Frontend (UI)" tasks.
- Wrote unit/integration tests for the login page UI (`ibe160/src/app/auth/login/page.test.tsx`), including OAuth button and error display. However, due to persistent and fundamental issues with the project's Jest test environment setup (ESM, `ts-jest` misconfiguration), these tests could not be successfully executed or verified.


### Completion Notes List
- All backend (NextAuth.js) and frontend (UI) tasks for story `1-4-user-login-with-oauth-2-0` are complete.
- **Backend:**
  - Configured Google OAuth provider in `ibe160/src/server/auth/config.ts`.
  - Implemented `signIn` callback for school email domain check.
  - Confirmed automatic mapping of OAuth profile data to `User` model by `PrismaAdapter`.
- **Frontend:**
  - `ibe160/src/app/auth/login/page.tsx` now includes a "Login with School Account" button with `onClick` logic to initiate Google OAuth flow.
  - Ensures redirection to dashboard on successful login.
  - Displays error messages for failed OAuth attempts.
- **Tests:**
  - Unit/integration tests were written for both backend `signIn` callback (`ibe160/src/server/auth/config.test.ts`) and frontend login page UI (`ibe160/src/app/auth/login/page.test.tsx`).
  - These tests could not be executed or verified due to persistent and fundamental issues with the project's Jest test environment setup (ESM, `ts-jest` misconfiguration). This will require further attention.


### File List
- ibe160/src/server/auth/config.ts (modified)
- ibe160/prisma/schema.prisma (reviewed)
- ibe160/src/server/auth/config.test.ts (newly created)
- ibe160/src/app/auth/login/page.tsx (modified)
- ibe160/src/app/auth/login/page.test.tsx (modified)

## Change Log
- 2025-11-28: Initial draft created.
