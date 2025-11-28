# Story 1.3: Email Verification & Account Activation

Status: ready-for-dev

## Story

As a new user,
I want to verify my email address by clicking a link,
so that my account can be activated and I can log in.

## Acceptance Criteria

1. Verification email contains a unique, time-limited link.
2. Clicking the link activates the user's account by updating the `emailVerified` field in the database.
3. User is redirected to a login page or a success message after verification.
4. Unverified accounts cannot log in.

## Tasks / Subtasks

- [ ] **Backend (API)**
  - [ ] Generate a unique, secure, and time-limited token for email verification. (AC: #1)
  - [ ] Create a tRPC procedure to handle the verification link click. (AC: #2)
  - [ ] Implement logic to validate the token and update the `User`'s `emailVerified` status in the database. (AC: #2)
  - [ ] Modify the login procedure to check the `emailVerified` status before authenticating the user. (AC: #4)
  - [ ] Add subtask for testing the verification and login procedures.
- [ ] **Frontend (UI)**
  - [ ] Create a page to handle the verification link, which shows a success or error message. (AC: #3)
  - [ ] Implement logic to display an "unverified account" message on the login page if an unverified user tries to log in. (AC: #4)
  - [ ] Add subtask for testing the verification page and login behavior for unverified users.
- [ ] **Email Template**
  - [ ] Design and implement an email template for the verification email using `react-email`. (AC: #1)
  - [ ] Ensure the template includes the unique verification link.

## Dev Notes

### Learnings from Previous Story
*   Previous stories established the project structure and user registration flow. This story builds on the user registration by adding the email verification step.

### Relevant architecture patterns and constraints
*   **Token Generation:** Use a secure method for token generation, such as `crypto.randomBytes`. Store a hash of the token in the database for comparison.
*   **Authentication:** The login flow in `NextAuth.js` must be updated to prevent login for users with `emailVerified` set to `false`.
*   **API:** The verification tRPC procedure should be a public procedure that does not require authentication.
*   **Email:** Use the `Resend` service to send the verification email.

### Project Structure Notes
*   The verification page can be created at `/auth/verify`.
*   The email template can be located in a new `src/emails` directory.

### References
*   [Source: docs/epics.md#Epic-1]
*   [Source: docs/PRD.md#FR001]
*   [Source: docs/architecture.md#Authentication]
*   [Source: docs/architecture.md#Email-Service]

## Dev Agent Record

### Context Reference

- docs/sprint-artifacts/1-3-email-verification-account-activation.context.xml

### Agent Model Used
{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List

## Change Log
- 2025-11-28: Initial draft created.
