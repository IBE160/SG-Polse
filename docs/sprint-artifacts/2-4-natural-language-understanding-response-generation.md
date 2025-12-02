# Story 2.4: Natural Language Understanding & Response Generation

Status: in-progress

## Story

As a student,
I want the chatbot to understand my questions and generate concise, relevant answers,
so that I can quickly get the information I need.

## Acceptance Criteria

1. The chatbot can process natural language queries from the user.
2. The chatbot generates answers based on the indexed course data in Pinecone.
3. The answers are concise and directly address the user's question.
4. The chatbot maintains single-session context for follow-up questions within the same session.

## Tasks / Subtasks

- [ ] **Backend (API)**
  - [x] Create a new tRPC procedure to handle chatbot queries. (AC: #1)
  - [x] In the tRPC procedure, take the user's query and convert it into an embedding. (AC: #1)
  - [x] Use the Pinecone service to query the vector database with the query embedding to find the most relevant text chunks. (AC: #2)
  - [x] Implement a prompt engineering strategy to combine the user's query and the retrieved text chunks into a prompt for a large language model (LLM).
  - [x] Integrate with an LLM (e.g., via Hugging Face, OpenAI) to generate a concise answer based on the prompt. (AC: #3)
  - [x] Implement a simple mechanism to handle conversation history for single-session context. (AC: #4)
  - [x] Add subtask for testing the entire query-to-answer pipeline.
- [ ] **Frontend (UI)**
  - [x] Integrate the chatbot UI with the new tRPC procedure, sending the user's query and receiving the generated answer.

## Dev Notes

### Learnings from Previous Story
*   The UI for the chatbot was created in the previous story. This story implements the "brain" of the chatbot.

### Relevant architecture patterns and constraints
*   **RAG (Retrieval-Augmented Generation):** This story implements a classic RAG pattern. The quality of the answers will depend on the quality of the retrieved context and the prompt sent to the LLM.
*   **LLM Integration:** The choice of LLM is a key decision. The implementation should be modular to allow for easy swapping of models.
*   **API:** The entire process will be encapsulated in a single tRPC procedure.

### Project Structure Notes
*   The tRPC router for the chatbot should be in `src/server/api/routers/chatbot.ts`.
*   The prompt templates can be stored in a separate file in `src/server/prompts/`.

### References
*   [Source: docs/epics.md#Epic-2]
*   [Source: docs/PRD.md#FR004]
*   [Source: docs/PRD.md#FR006]
*   [Source: docs/PRD.md#FR008]
*   [Source: docs/architecture.md#API-Communication]

## Dev Agent Record

### Context Reference
- docs/sprint-artifacts/2-4-natural-language-understanding-response-generation.context.xml

### Agent Model Used
{{agent_model_name_version}}

### Debug Log References
- Attempted to run Jest tests for src/server/api/routers/chatbot.test.ts.
- Encountered persistent "No tests found" error and "Next.js inferred your workspace root, but it may not be correct" warning.
- Tried various Jest configuration adjustments (rootDir, direct config, package.json script modifications, ESM vs CommonJS setup) without success in resolving the test discovery issue.
- This is a HALT condition as verification of new code via tests could not be completed.

### Completion Notes List
- All backend API tasks for NLU and Response Generation are implemented as per story requirements.
- Implemented tRPC procedure for chatbot queries, including embedding generation, Pinecone context retrieval, prompt engineering, and LLM integration.
- Conversation history handling is integrated into the prompt generation.
- Frontend UI integration is also complete, allowing the chatbot interface to send user queries and receive generated answers via the new tRPC procedure.
- The story cannot be marked as 'review' because automated tests for the new backend logic could not be performed due to persistent Jest configuration issues in the current project setup. This remains a HALT condition.

### File List
- src/server/api/routers/chatbot.ts (New)
- src/server/api/root.ts (New)
- src/app/api/trpc/[trpc]/route.ts (New)
- src/server/api/trpc.ts (New)
- src/server/auth.ts (New)
- src/env.mjs (Modified)
- src/server/db.ts (New)
- src/server/services/embedding.ts (New)
- src/server/services/pinecone.ts (Modified)
- src/server/services/llm.ts (New)
- src/types/chat.ts (New)
- src/server/api/routers/chatbot.test.ts (New)
- ibe160/jest.config.cjs (Modified multiple times, currently reverted)
- ibe160/package.json (Modified multiple times, currently reverted)
- ibe160/jest.setup.js (Modified)

## Change Log
- 2025-11-28: Initial draft created.
- 2025-12-02: Backend API implementation for NLU and Response Generation completed. Story status updated to in-progress. Test implementation added, but test execution blocked by configuration issues.
