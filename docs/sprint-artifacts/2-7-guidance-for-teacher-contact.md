# Story 2.7: Guidance for Teacher Contact

Status: ready-for-dev

## Story

As a student,
if the chatbot cannot answer my question,
I want it to guide me on how to contact my teacher,
so that I can get further assistance.

## Acceptance Criteria

1. When the chatbot cannot provide a relevant answer from the knowledge base, it offers clear instructions on teacher contact methods.
2. The contact instructions are customizable by the teacher or institution.

## Tasks / Subtasks

- [ ] **Backend (API)**
  - [ ] In the chatbot tRPC procedure, add a condition to check the confidence score or relevance of the retrieved documents from Pinecone.
  - [ ] If the confidence is below a certain threshold, instead of generating an answer, return a predefined "I can't answer that" message along with the teacher contact information. (AC: #1)
  - [ ] Create a mechanism to store and retrieve the customizable contact information (e.g., from a database table or a configuration file). (AC: #2)
  - [ ] Add subtask for testing the fallback mechanism.
- [ ] **Frontend (UI)**
  - [ ] Update the chat message component to display the formatted "I can't answer that" message and the teacher contact information. (AC: #1)
  - [ ] Add subtask for testing that the contact information is displayed correctly.

## Dev Notes

### Learnings from Previous Story
*   This story adds an important fallback mechanism to the chatbot, improving the user experience when the bot is not confident in its answer.

### Relevant architecture patterns and constraints
*   **Confidence Threshold:** The choice of confidence threshold is a key parameter to tune. A low threshold will result in more answers, but some may be inaccurate. A high threshold will result in fewer, more accurate answers, but more "I can't answer that" responses.
*   **Configuration Management:** The teacher contact information should be easy to update without requiring a code change. Storing it in the database is a good approach.

### Project Structure Notes
*   A new database model might be needed for storing configuration data like the teacher contact information.

### References
*   [Source: docs/epics.md#Epic-2]
*   [Source: docs/PRD.md#FR012]

## Dev Agent Record

### Context Reference
- docs/sprint-artifacts/2-7-guidance-for-teacher-contact.context.xml

### Agent Model Used
{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List

## Change Log
- 2025-11-28: Initial draft created.
