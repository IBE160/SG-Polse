# Story 2.1: Canvas LMS Integration for Course Data

Status: blocked

## Story

As a system administrator,
I want the chatbot to securely connect to the Canvas LMS,
so that it can access course information like syllabi, assignments, and deadlines for IBE160.

## Acceptance Criteria

1. The system can securely connect to the Canvas LMS API using an API token.
2. The system can retrieve a list of courses for the authenticated user (or a system-level user).
3. The system can retrieve a list of documents (e.g., syllabus, assignment descriptions) for a specific course (IBE160).
4. The connection and data retrieval are handled in a dedicated service module.

## Tasks / Subtasks

- [x] **Backend (API Client)**
  - [x] Create a new service module for the Canvas API client at `src/server/services/canvas.ts`. (AC: #4)
  - [x] Implement a function to establish a secure connection to the Canvas API using an API token stored in environment variables. (AC: #1)
  - [x] Implement a function to fetch a list of courses. (AC: #2)
  - [x] Implement a function to fetch a list of files/documents for a given course ID. (AC: #3)
  - [x] Add subtask for testing the Canvas API client functions (using mock data).
- [x] **Configuration**
  - [x] Add environment variables for the Canvas API endpoint and API token to `.env` and `env.mjs` for validation. (AC: #1)
- [x] **tRPC (Optional)**
  - [x] Create a tRPC procedure to expose the course list or document list if needed for an admin interface (out of scope for this story, but consider the possibility).

## Dev Notes

### Learnings from Previous Story
*   Epic 1 established the core application structure. This story is the first major integration with an external service.

### Relevant architecture patterns and constraints
*   **Service Layer:** All external API interactions should be encapsulated within a dedicated service module. This decouples the application logic from the specific implementation of the external API.
*   **Security:** The Canvas API token is a sensitive secret and must be stored securely in environment variables. It should never be exposed to the client-side.
*   **Error Handling:** The Canvas API client should handle potential errors (e.g., network errors, authentication errors, invalid responses) gracefully.

### Project Structure Notes
*   The new Canvas service will be located at `src/server/services/canvas.ts` as per the architecture document.

### References
*   [Source: docs/epics.md#Epic-2]
*   [Source: docs/PRD.md#FR009]
*   [Source: docs/architecture.md#Integration-Points]

## Dev Agent Record

### Context Reference
- docs/sprint-artifacts/2-1-canvas-lms-integration-for-course-data.context.xml

### Agent Model Used
{{agent_model_name_version}}

### Debug Log References
- **Plan for Task: Create Canvas API Client Service Module**
  1. **Create File:** Create `src/server/services/canvas.ts`.
  2. **Define `CanvasApiClient` Class:** Implement the class structure as specified in the `interfaces` section of the context file.
     *   `constructor(apiUrl: string, apiToken: string)`: Initialize with API URL and token.
     *   `getAuthHeaders()`: Return authentication headers.
     *   `fetchCourses()`: Placeholder for fetching courses.
     *   `fetchCourseDocuments(courseId: string)`: Placeholder for fetching course documents.
  3. **Basic Implementation:**
     *   The `constructor` will store `apiUrl` and `apiToken`.
     *   `getAuthHeaders` will construct the `Authorization: Bearer <apiToken>` header.
     *   `fetchCourses` and `fetchCourseDocuments` will initially return empty arrays or throw errors, as their full implementation is part of later subtasks. The primary goal of *this* task is to create the module and define the class.
  4. **Error Handling (Basic):** Include basic error handling (e.g., try-catch blocks) in the methods, returning more informative errors. This aligns with the constraint.

- **Plan for Task: Implement secure connection to Canvas API (AC: #1)**
  1. **Environment Variables:** Define `CANVAS_API_URL` and `CANVAS_API_TOKEN` in `.env` (development) and ensure `env.mjs` is updated for validation.
  2. **`CanvasApiClient` Integration:**
     *   Modify the `CanvasApiClient` constructor to take `apiUrl` and `apiToken` from `process.env` or a secure configuration object.
     *   Ensure `getAuthHeaders` correctly uses `this.apiToken`.
  3. **Basic Test (Manual/Conceptual):** Verify that instantiating `CanvasApiClient` with dummy environment variables does not throw an error and that `getAuthHeaders` returns the expected header. (Actual testing will be in a later subtask).

- **Plan for Task: Implement `fetchCourses` in `CanvasApiClient` (AC: #2)**
  1. **Modify `fetchCourses` method in `src/server/services/canvas.ts`:**
     *   Construct the Canvas API endpoint URL for fetching courses (e.g., `/courses`).
     *   Make an HTTP GET request to the Canvas API using `fetch` or a similar library.
     *   Include authentication headers from `getAuthHeaders()`.
     *   Parse the response as JSON.
     *   Map the API response data to the `CanvasCourse` interface.
     *   Implement basic error handling for network issues or API errors.

- **Plan for Task: Implement `fetchCourseDocuments` in `CanvasApiClient` (AC: #3)**
  1. **Modify `fetchCourseDocuments` method in `src/server/services/canvas.ts`:**
     *   Construct the Canvas API endpoint URL for fetching course documents (e.g., `/courses/:courseId/files`).
     *   Make an HTTP GET request to the Canvas API.
     *   Include authentication headers from `getAuthHeaders()`.
     *   Parse the response as JSON.
     *   Map the API response data to the `CanvasDocument` interface.
     *   Implement basic error handling for network issues or API errors.

- **Plan for Task: Add tests for Canvas API client functions (AC: #1, #2, #3, #4)**
  1.  **Create Test File:** Create `ibe160/src/server/services/canvas.test.ts`.
  2.  **Mock Environment Variables:** Set up mock environment variables for `CANVAS_API_URL` and `CANVAS_API_TOKEN` for testing purposes.
  3.  **Test `CanvasApiClient` Constructor and `getAuthHeaders`:**
      *   Verify that `CanvasApiClient` can be instantiated with mock environment variables.
      *   Verify that `getAuthHeaders()` returns the correct `Authorization` header.
  4.  **Test `fetchCourses`:**
      *   Mock `fetch` to simulate a successful Canvas API response for courses.
      *   Verify that `fetchCourses()` correctly parses the mocked response and returns `CanvasCourse[]`.
      *   Test error handling for `fetchCourses()` (e.g., non-ok response, network error).
  5.  **Test `fetchCourseDocuments`:**
      *   Mock `fetch` to simulate a successful Canvas API response for documents.
      *   Verify that `fetchCourseDocuments()` correctly parses the mocked response and returns `CanvasDocument[]`.
      *   Test error handling for `fetchCourseDocuments()` (e.g., non-ok response, network error).
  6.  **Test `env.js` Validation:** (This is part of the "Configuration" task, but it's a good place to consolidate all testing related to Canvas integration.)
      *   Create a separate test or integrate into an existing one to ensure `CANVAS_API_URL` and `CANVAS_API_TOKEN` are validated by `env.js`. (This might be outside `canvas.test.ts` if `env.js` has its own test setup).

### Completion Notes List
- Created `src/server/services/canvas.ts` and defined the basic `CanvasApiClient` class structure.
- Added `CANVAS_API_URL` and `CANVAS_API_TOKEN` to `ibe160/.env` and `ibe160/src/env.js` for validation.
- Implemented `fetchCourses` method in `src/server/services/canvas.ts` to retrieve courses from Canvas LMS API.
- Implemented `fetchCourseDocuments` method in `src/server/services/canvas.ts` to retrieve documents for a given course ID from Canvas LMS API.
- Added test file `src/server/services/canvas.test.ts` with unit and integration tests for `CanvasApiClient` methods.
- **Note on Test Failures:** All tasks for Canvas integration are complete, and the new test file `ibe160/src/server/services/canvas.test.ts` passes when run in isolation. However, the full test suite (`npm test`) fails due to persistent Jest configuration issues related to ESM modules, Prisma Client mocking, and `next/navigation` mocks in existing project test files. This prevents full validation of the story's implementation via the automated test suite.

### File List
- Added: `ibe160/src/server/services/canvas.ts`
- Modified: `ibe160/src/env.js`
- Added: `ibe160/src/server/services/canvas.test.ts`
- Modified: `ibe160/jest.config.cjs`
- Modified: `ibe160/jest.setup.js`
- Modified: `ibe160/package.json`
- Modified: `ibe160/tsconfig.json`
- Modified: `ibe160/src/app/auth/login/page.test.tsx`
- Modified: `ibe160/src/app/auth/verify/page.test.tsx`
- Modified: `ibe160/src/server/auth/config.test.ts`
- Modified: `ibe160/src/server/api/routers/auth.test.ts`

## Change Log
- 2025-11-28: Initial draft created.
- 2025-12-01: Implemented Canvas LMS integration: created `CanvasApiClient` module, configured environment variables, and implemented `fetchCourses` and `fetchCourseDocuments`. Added dedicated tests for the Canvas API client. Noted blocked status due to persistent Jest configuration issues in existing test suite.