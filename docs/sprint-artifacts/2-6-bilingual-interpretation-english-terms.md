# Story 2.6: Bilingual Interpretation (English Terms)

Status: in-progress

## Story

As a student,
I want the chatbot to accurately interpret questions that contain English terms within another language,
so that I can ask questions naturally.

## Acceptance Criteria

1. The chatbot successfully identifies and processes English terms embedded in non-English queries.
2. Responses are generated based on the correct interpretation of the mixed-language query.

## Tasks / Subtasks

- [x] **Backend (API)**
  - [x] Research and select a language detection library or service. (AC: #1)
  - [x] In the chatbot tRPC procedure, before generating the embedding for the user's query, pass the query through the language detection service.
  - [x] Use a multilingual embedding model that can handle mixed-language queries directly.
  - [x] Integrate embedding generation and vector search (RAG) into the chatbot procedure.
  - [x] Update the prompt to the LLM to specify the language of the user's query and instruct it to respond in the same language. (AC: #2)
  - [x] Add subtask for testing with a variety of mixed-language queries.
  - [x] **Testing**: Write integration tests for the `queryChatbot` procedure to verify bilingual interpretation. (AC: #1, #2)
  - [x] Fix Jest + ESM configuration issues to enable tests.

## Dev Notes

### Learnings from Previous Story
*   This story adds a layer of complexity to the natural language understanding capabilities of the chatbot.

### Relevant architecture patterns and constraints
*   **Multilingual Models:** The most robust solution is to use a multilingual embedding model that is specifically trained to handle multiple languages and code-switching.
*   **Translation as a fallback:** If a multilingual model is not feasible, using a translation service is a viable alternative, but it may introduce latency and translation errors.
*   **Prompt Engineering:** The prompt to the LLM should be explicit about the expected output language.

### Project Structure Notes
*   A new service for language detection or translation might be needed in `src/server/services/`.

### References
*   [Source: docs/epics.md#Epic-2]
*   [Source: docs/PRD.md#FR007]

## Dev Agent Record

### Context Reference
- docs/sprint-artifacts/2-6-bilingual-interpretation-english-terms.context.xml

### Agent Model Used
{{agent_model_name_version}}

### Debug Log References
- **2025-12-02**:
  - Selected `franc` as the language detection library after `cld3-wasm` was not found.
  - Installed `franc` dependency.
  - Created `LanguageService` at `ibe160/src/server/services/language.ts`.
  - Created new `chatbot` tRPC router and procedure at `ibe160/src/server/api/routers/chatbot.ts`.
  - Integrated `languageService` into the `queryChatbot` procedure.
  - Updated `appRouter` to include the new `chatbotRouter`.
  - Researched `text-embedding-ada-002` and confirmed its multilingual capabilities. Decided against a translation step, opting to use the existing model directly, which aligns with the "most robust solution" note.
  - Implemented OpenAI client call in `chatbot.ts` and created `ibe160/src/env.mjs` to handle the `OPENAI_API_KEY` environment variable, ensuring consistency with the existing embedding service.
  - Wrote integration tests for the new `queryChatbot` procedure in `chatbot.test.ts`.
  - **BLOCKED (Resolved)**: Jest + ESM configuration issue resolved by updating `jest.config.server.cjs` to `.mjs`, leveraging `ts-jest` preset `default-esm`, creating a custom `openai` mock, and ensuring all environment variables are correctly provided via `cross-env`. All server tests now pass.
  - Created `EmbeddingService` at `ibe160/src/server/services/embedding.ts`.
  - Created mock `PineconeService` at `ibe160/src/server/services/pinecone.ts`.
  - Integrated `embeddingService` and `pineconeService` into `queryChatbot` to implement the full RAG flow.
  - Updated `chatbot.test.ts` to correctly mock OpenAI and include a mixed-language test case.

### Completion Notes List

### File List
- `ibe160/src/server/services/language.ts` (new)
- `ibe160/src/server/services/embedding.ts` (new)
- `ibe160/src/server/services/pinecone.ts` (new)
- `ibe160/src/server/api/routers/chatbot.ts` (modified)
- `ibe160/src/server/api/root.ts` (modified)
- `ibe160/src/env.mjs` (modified - was ibe160/src/env.js)
- `ibe160/src/server/api/routers/chatbot.test.ts` (modified)
- `ibe160/jest.config.server.mjs` (modified from .cjs)
- `ibe160/__mocks__/openai.ts` (new)

## Change Log
- 2025-11-28: Initial draft created.
