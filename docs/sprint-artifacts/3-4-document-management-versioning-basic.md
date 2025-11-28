# Story 3.4: Document Management & Versioning (Basic)

Status: ready-for-dev

## Story

As a teacher,
I want to view a list of documents I have uploaded for a course and manage them,
so that I can ensure the chatbot uses the correct and most up-to-date materials.

## Acceptance Criteria

1. The teacher can see a list of all documents uploaded for a specific course.
2. The teacher can delete existing documents.
3. Uploading a new version of an existing document replaces the old version in the knowledge base.

## Tasks / Subtasks

- [ ] **Backend (API)**
  - [ ] Create a tRPC procedure to list the documents in Supabase Storage for a given course. (AC: #1)
  - [ ] Create a tRPC procedure to delete a document from Supabase Storage. (AC: #2)
  - [ ] When a document is deleted, trigger an event to remove its embeddings from Pinecone.
- [ ] **Frontend (UI)**
  - [ ] On the content management page, display the list of uploaded documents. (AC: #1)
  - [ ] Add a "delete" button for each document. (AC: #2)
  - [ ] Implement a confirmation dialog before deleting a document.
  - [ ] The existing upload functionality should handle replacing documents with the same name. (AC: #3)
  - [ ] Add subtask for testing the document list and delete functionality.

## Dev Notes

### Learnings from Previous Story
*   This story completes the basic content management functionality for teachers.

### Relevant architecture patterns and constraints
*   **Data Consistency:** Deleting a document from storage should also trigger a cleanup of the corresponding embeddings in the vector database to avoid stale data.
*   **Soft Deletes:** For a more robust system, consider implementing soft deletes instead of permanently deleting documents. This is out of scope for the MVP but a good future consideration.

### Project Structure Notes
*   This story will primarily involve modifications to the teacher content management page at `/teacher/course/{courseId}` and the teacher tRPC router.

### References
*   [Source: docs/epics.md#Epic-3]
*   [Source: docs/PRD.md#FR010]
*   [Source: docs/PRD.md#FR011]

## Dev Agent Record

### Context Reference
- docs/sprint-artifacts/3-4-document-management-versioning-basic.context.xml

### Agent Model Used
{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List

## Change Log
- 2025-11-28: Initial draft created.
