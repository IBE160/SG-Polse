# Story 3.2: Document Upload Interface for Teachers

Status: ready-for-dev

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

- [ ] **Backend (API)**
  - [ ] Create a tRPC procedure to generate a presigned URL for uploading a file to Supabase Storage. (AC: #4)
  - [ ] This procedure should be protected to ensure only the assigned teacher can upload documents for a course.
  - [ ] Add subtask for testing the presigned URL generation.
- [ ] **Frontend (UI)**
  - [ ] Create a content management page for a course at `/teacher/course/{courseId}`. (AC: #1)
  - [ ] On this page, implement a file upload component. (AC: #2)
  - [ ] The component should use the tRPC procedure to get a presigned URL and then upload the file directly to Supabase Storage.
  - [ ] Display the upload progress to the user. (AC: #3)
  - [ ] Display a success or error message after the upload is complete.
  - [ ] Add subtask for testing the file upload UI and process.

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

### Completion Notes List

### File List

## Change Log
- 2025-11-28: Initial draft created.
