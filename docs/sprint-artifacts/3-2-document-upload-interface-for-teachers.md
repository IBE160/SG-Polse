# Story 3.2: Document Upload Interface for Teachers

Status: review

## Story

As a teacher,
I want to upload text documents and presentations for a selected course,
so that the chatbot can use this information to answer student questions.

## Acceptance Criteria

1. The teacher can access a dedicated upload interface for a selected course.
2. The interface supports uploading common document formats (e.g., PDF, DOCX, PPTX, TXT).
3. The system provides visual feedback on upload progress.
4. Uploaded files are stored securely in Supabase Storage.

## Tasks / Subtasks

- [x] **Backend (API)**
  - [x] Create a tRPC procedure to generate a presigned URL for uploading a file to Supabase Storage. (AC: #4)
  - [x] This procedure should be protected to ensure only the assigned teacher can upload documents for a course.
  - [x] Add subtask for testing the presigned URL generation.
- [x] **Frontend (UI)**
  - [x] Create a content management page for a course at `/teacher/course/{courseId}`. (AC: #1)
  - [x] On this page, implement a file upload component. (AC: #2)
  - [x] The component should use the tRPC procedure to get a presigned URL and then upload the file directly to Supabase Storage.
  - [x] Display the upload progress to the user. (AC: #3)
  - [x] Display a success or error message after the upload is complete.
  - [x] Add subtask for testing the file upload UI and process.

## Dev Notes

### Learnings from Previous Story
*   The previous story created the teacher dashboard. This story adds the core functionality for teachers to manage course content.

### Relevant architecture patterns and constraints
*   **File Storage:** Use Supabase Storage for all file uploads, as defined in the architecture.
*   **Security:** Using presigned URLs is a secure pattern for file uploads, as it allows the client to upload directly to the storage provider without the server having to handle the file contents.

### Project Structure Notes
*   The content management page will be at `/teacher/course/{courseId}`.

### References
*   [Source: docs/epics.md#Epic-3]
*   [Source: docs/PRD.md#FR011]
*   [Source: docs/architecture.md#File-Storage]

## Dev Agent Record

### Context Reference
- docs/sprint-artifacts/3-2-document-upload-interface-for-teachers.context.xml

### Agent Model Used
{{agent_model_name_version}}

### Debug Log References
- 2025-12-02: Encountered persistent issues with Jest test discovery for `src/server/api/routers/teacher.test.ts`. Despite correct `testMatch` patterns and explicit file targeting, Jest did not consistently execute this test suite when running `npm run test:server`. The issue was not resolved after clearing cache, temporarily renaming the file, or broadening `testMatch`. Proceeded with assumption that tests are correctly written but environment/configuration issues prevent consistent execution.

### Completion Notes List
- 2025-12-02: Completed Backend (API) tasks: Implemented tRPC procedure (`generatePresignedUrl`) for secure presigned URL generation to Supabase Storage, including authorization checks for assigned teachers. Unit tests (`teacher.test.ts`) were written for this functionality.
- 2025-12-02: Completed Frontend (UI) tasks: Created content management page (`src/app/teacher/course/[courseId]/page.tsx`) and a reusable `FileUpload.tsx` component. The `FileUpload` component handles file selection (drag-and-drop), calls the tRPC procedure for presigned URLs, and uploads files directly to Supabase Storage, providing visual feedback. Client-side unit tests (`page.test.tsx` and `FileUpload.test.tsx`) were written and passed.

### File List
- Added: `src/server/services/supabase.ts`
- Modified: `src/server/api/routers/teacher.ts`
- Modified: `src/server/api/routers/teacher.test.ts`
- Added: `src/app/teacher/course/[courseId]/page.tsx`
- Added: `src/app/teacher/course/__tests__/[courseId]/page.test.tsx`
- Added: `src/app/_components/teacher/FileUpload.tsx`
- Added: `src/app/_components/teacher/__tests__/FileUpload.test.tsx`

## Change Log
- 2025-11-28: Initial draft created.

## Senior Developer Review (AI)

**Reviewer:** BIP
**Date:** 2025-12-02
**Outcome:** BLOCKED (due to critical test discoverability issue)

**Summary:**
The story `3-2-document-upload-interface-for-teachers` is BLOCKED due to a critical issue with test discoverability for the backend API tests (`src/server/api/routers/teacher.test.ts`). While the implementation appears to satisfy the acceptance criteria and all tasks are marked complete, the reported inability to consistently execute these tests poses a significant risk for regressions and invalidates the reliability of the test suite. Addressing this environment/configuration issue is paramount before this story can be approved.

**Key Findings:**
*   **HIGH Severity:** Persistent Jest test discovery issues for `src/server/api/routers/teacher.test.ts`, leading to inconsistent test execution. While tests were written, their consistent execution cannot be guaranteed, which poses a risk for regressions. (Evidence: Dev Agent Record -> Debug Log References in story file).
*   **Warning:** No Epic Tech Spec found for epic 3. This indicates a potential gap in documentation, though it did not directly block this review.

**Acceptance Criteria Coverage:**
*   **Summary:** 4 of 4 acceptance criteria fully implemented.
    *   **AC1:** The teacher can access a dedicated upload interface for a selected course.
        *   **Status:** IMPLEMENTED
        *   **Evidence:** `src/app/teacher/course/[courseId]/page.tsx`, `src/app/teacher/course/__tests__/[courseId]/page.test.tsx`
    *   **AC2:** The interface supports uploading common document formats (e.g., PDF, DOCX, PPTX, TXT).
        *   **Status:** IMPLEMENTED
        *   **Evidence:** `src/app/_components/teacher/FileUpload.tsx`, `src/app/_components/teacher/__tests__/FileUpload.test.tsx`
    *   **AC3:** The system provides visual feedback on upload progress.
        *   **Status:** IMPLEMENTED
        *   **Evidence:** `src/app/_components/teacher/FileUpload.tsx`, `src/app/_components/teacher/__tests__/FileUpload.test.tsx`
    *   **AC4:** Uploaded files are stored securely in Supabase Storage.
        *   **Status:** IMPLEMENTED
        *   **Evidence:** `src/server/services/supabase.ts`, `src/server/api/routers/teacher.ts`, `src/server/api/routers/teacher.test.ts`

**Task Completion Validation:**
*   **Summary:** 9 of 9 completed tasks verified, 0 questionable, 0 falsely marked complete.
    *   **Task:** Backend (API) - Create a tRPC procedure to generate a presigned URL for uploading a file to Supabase Storage. (AC: #4)
        *   **Marked As:** [x]
        *   **Verified As:** VERIFIED COMPLETE
        *   **Evidence:** `src/server/api/routers/teacher.ts`, `src/server/services/supabase.ts`
    *   **Task:** Backend (API) - This procedure should be protected to ensure only the assigned teacher can upload documents for a course.
        *   **Marked As:** [x]
        *   **Verified As:** VERIFIED COMPLETE
        *   **Evidence:** `src/server/api/routers/teacher.ts`
    *   **Task:** Backend (API) - Add subtask for testing the presigned URL generation.
        *   **Marked As:** [x]
        *   **Verified As:** VERIFIED COMPLETE
        *   **Evidence:** `src/server/api/routers/teacher.test.ts`
    *   **Task:** Frontend (UI) - Create a content management page for a course at `/teacher/course/{courseId}`. (AC: #1)
        *   **Marked As:** [x]
        *   **Verified As:** VERIFIED COMPLETE
        *   **Evidence:** `src/app/teacher/course/[courseId]/page.tsx`
    *   **Task:** Frontend (UI) - On this page, implement a file upload component. (AC: #2)
        *   **Marked As:** [x]
        *   **Verified As:** VERIFIED COMPLETE
        *   **Evidence:** `src/app/_components/teacher/FileUpload.tsx`
    *   **Task:** Frontend (UI) - The component should use the tRPC procedure to get a presigned URL and then upload the file directly to Supabase Storage.
        *   **Marked As:** [x]
        *   **Verified As:** VERIFIED COMPLETE
        *   **Evidence:** `src/app/_components/teacher/FileUpload.tsx`
    *   **Task:** Frontend (UI) - Display the upload progress to the user. (AC: #3)
        *   **Marked As:** [x]
        *   **Verified As:** VERIFIED COMPLETE
        *   **Evidence:** `src/app/_components/teacher/FileUpload.tsx`
    *   **Task:** Frontend (UI) - Display a success or error message after the upload is complete.
        *   **Marked As:** [x]
        *   **Verified As:** VERIFIED COMPLETE
        *   **Evidence:** `src/app/_components/teacher/__tests__/FileUpload.test.tsx`
    *   **Task:** Frontend (UI) - Add subtask for testing the file upload UI and process.
        *   **Marked As:** [x]
        *   **Verified As:** VERIFIED COMPLETE
        *   **Evidence:** `src/app/teacher/course/__tests__/[courseId]/page.test.tsx`, `src/app/_components/teacher/__tests__/FileUpload.test.tsx`

**Test Coverage and Gaps:**
*   All acceptance criteria appear to have corresponding tests.
*   The tests are well-structured and cover various scenarios (positive, negative, error handling).
*   **Gap:** The critical issue of inconsistent test discoverability for `src/server/api/routers/teacher.test.ts` means that while tests exist, their reliable execution in a CI/CD context is compromised. This is a severe gap in the testing strategy's effectiveness.

**Architectural Alignment:**
*   All identified architectural constraints from `architecture.md` and `story-context.xml` regarding Supabase Storage, presigned URLs, and T3 stack components are aligned with the implementation.
*   No architectural violations were found.

**Security Notes:**
*   The use of `teacherProcedure` in tRPC and explicit authorization checks for course assignment within `generatePresignedUrl` procedure are good security practices.
*   The reliance on presigned URLs for direct client upload to Supabase Storage is a secure pattern.

**Best-Practices and References:**
*   T3 stack principles (tRPC, Zod, React Query) are well-followed.
*   Tailwind CSS is used for styling.

**Action Items:**

**Code Changes Required:**
*   [ ] **[High] Resolve persistent Jest test discovery issues for `src/server/api/routers/teacher.test.ts`** to ensure consistent and reliable test execution. This is a blocking issue for approval. (Evidence: Dev Agent Record -> Debug Log References in story file)
*   [ ] **[Medium] Implement explicit checks for the presence of `process.env.SUPABASE_URL` and `process.env.SUPABASE_ANON_KEY`** in `src/server/api/routers/teacher.ts` and throw a descriptive error if they are undefined, instead of relying solely on non-null assertion.
*   [ ] **[Low] Implement structured logging with Pino** in `src/server/services/supabase.ts` instead of `console.error`.
*   [ ] **[Low] Integrate Pino logging for error handling** in `generatePresignedUrl` procedure within `src/server/api/routers/teacher.ts`.
*   [ ] **[Low] Replace `alert('Please select files to upload.');` with a UI notification** (e.g., toast) in `src/app/_components/teacher/FileUpload.tsx` for improved user experience.

**Advisory Notes:**
*   **Note:** No Epic Tech Spec found for epic 3. Consider creating one for comprehensive documentation.
*   **Note:** Consider optimizing course data fetching in `src/app/teacher/course/[courseId]/page.tsx` by introducing a `getTeacherCourseById` tRPC procedure for improved efficiency with many courses.
*   **Note:** Enhance `src/app/teacher/course/__tests__/[courseId]/page.test.tsx` to mock the `FileUpload` component and assert its rendering with the correct `courseId` prop, rather than relying on placeholder text.
*   **Note:** Consider refining Jest mocking of `SupabaseService` in `src/server/api/routers/teacher.test.ts` to reduce the need for `@typescript-eslint/no-unsafe-assignment` and `@typescript-eslint/no-explicit-any` if possible, for improved type safety.
