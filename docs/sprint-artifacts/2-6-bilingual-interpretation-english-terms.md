# Story 2.6: Bilingual Interpretation (English Terms)

Status: ready-for-dev

## Story

As a student,
I want the chatbot to accurately interpret questions that contain English terms within another language,
so that I can ask questions naturally.

## Acceptance Criteria

1. The chatbot successfully identifies and processes English terms embedded in non-English queries.
2. Responses are generated based on the correct interpretation of the mixed-language query.

## Tasks / Subtasks

- [ ] **Backend (API)**
  - [ ] Research and select a language detection library or service. (AC: #1)
  - [ ] In the chatbot tRPC procedure, before generating the embedding for the user's query, pass the query through the language detection service.
  - [ ] If the query is detected as mixed-language, consider a strategy to handle it. This could involve:
    -   Translating the non-English parts of the query to English before creating the embedding.
    -   Using a multilingual embedding model that can handle mixed-language queries directly.
  - [ ] Update the prompt to the LLM to specify the language of the user's query and instruct it to respond in the same language. (AC: #2)
  - [ ] Add subtask for testing with a variety of mixed-language queries.

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

### Completion Notes List

### File List

## Change Log
- 2025-11-28: Initial draft created.
