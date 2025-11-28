# Story 2.5: Answer Sourcing and Citation

Status: ready-for-dev

## Story

As a student,
I want the chatbot to provide sources for its answers,
so that I can verify the information and delve deeper if needed.

## Acceptance Criteria

1. Every chatbot answer includes a clear citation to the source document (e.g., "Source: Syllabus, Page 3").
2. Citations are accurate and link to the relevant part of the document if possible.

## Tasks / Subtasks

- [ ] **Backend (API)**
  - [ ] Modify the Pinecone service to store metadata (e.g., document name, page number) along with the embeddings. (AC: #1)
  - [ ] When querying Pinecone, retrieve the metadata for the most relevant text chunks. (AC: #1)
  - [ ] Include the source information in the prompt to the LLM, and instruct it to cite its sources in the answer.
  - [ ] Modify the tRPC procedure to return the generated answer along with a list of source citations. (AC: #1, #2)
  - [ ] Add subtask for testing that the API response includes accurate source information.
- [ ] **Frontend (UI)**
  - [ ] Update the chat message component to display the source citations below the chatbot's answer. (AC: #1)
  - [ ] If possible, make the citations clickable links that could open the source document. (AC: #2)
  - [ ] Add subtask for testing that citations are correctly displayed.

## Dev Notes

### Learnings from Previous Story
*   The previous story set up the core RAG pipeline. This story enhances that pipeline by adding the crucial feature of citation.

### Relevant architecture patterns and constraints
*   **Metadata in Vector DB:** Storing rich metadata alongside embeddings is a key pattern for enabling citations and filtering.
*   **Prompt Engineering:** The prompt to the LLM needs to be carefully engineered to encourage it to use the provided sources and cite them correctly.

### Project Structure Notes
*   No major changes to the project structure are expected. This story primarily involves modifications to the existing chatbot tRPC procedure and the frontend chat components.

### References
*   [Source: docs/epics.md#Epic-2]
*   [Source: docs/PRD.md#FR005]

## Dev Agent Record

### Context Reference
- docs/sprint-artifacts/2-5-answer-sourcing-and-citation.context.xml

### Agent Model Used
{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List

## Change Log
- 2025-11-28: Initial draft created.
