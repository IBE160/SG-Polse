# Story 2.2: Data Ingestion and Indexing from Canvas

Status: ready-for-dev

## Story

As a system,
I want to ingest and index course documents from Canvas into a vector database (Pinecone),
so that the chatbot can efficiently search and retrieve information.

## Acceptance Criteria

1. The system can parse various document formats (e.g., PDF, DOCX, TXT) retrieved from Canvas.
2. Content from parsed documents is extracted and converted into embeddings using an embedding model.
3. The generated embeddings and the original text content are stored in a Pinecone index for efficient retrieval.
4. A mechanism (e.g., a scheduled job or a manual trigger) exists to re-index updated documents from Canvas.

## Tasks / Subtasks

- [ ] **Backend (Data Pipeline)**
  - [ ] Implement a document parsing service that can handle different file formats (PDF, DOCX, TXT). (AC: #1)
  - [ ] Integrate an embedding model (e.g., from Hugging Face, OpenAI, or a similar service) to convert text content into vector embeddings. (AC: #2)
  - [ ] Create a Pinecone service module at `src/server/services/pinecone.ts` to handle interactions with the Pinecone API. (AC: #3)
  - [ ] Implement a function in the Pinecone service to upsert embeddings and metadata into a Pinecone index. (AC: #3)
  - [ ] Create a main ingestion script or service that orchestrates the process: fetching documents from Canvas (using the service from story 2.1), parsing them, creating embeddings, and storing them in Pinecone. (AC: #1, #2, #3)
  - [ ] Design and implement the re-indexing mechanism. (AC: #4)
  - [ ] Add subtask for testing the entire data ingestion and indexing pipeline.
- [ ] **Configuration**
  - [ ] Add environment variables for the Pinecone API key, environment, and index name.
  - [ ] Add environment variables for the chosen embedding model service if applicable.

## Dev Notes

### Learnings from Previous Story
*   Story 2.1 established the connection to Canvas. This story consumes the documents fetched from Canvas and processes them for the chatbot.

### Relevant architecture patterns and constraints
*   **Data Pipeline:** The process of fetching, parsing, embedding, and storing documents should be designed as a data pipeline. This could be a simple script for now, but should be designed with future scalability in mind (e.g., moving to background jobs).
*   **Embedding Model:** The choice of embedding model is a key decision. A good starting point would be a popular open-source model. The implementation should make it easy to swap out the model in the future.
*   **Vector Database:** All interactions with Pinecone should be encapsulated in the `pinecone.ts` service module.
*   **Idempotency:** The ingestion process should be idempotent, meaning running it multiple times with the same input should not create duplicate entries.

### Project Structure Notes
*   The Pinecone service will be located at `src/server/services/pinecone.ts`.
*   The document parsing logic could live in a new `src/server/services/parser.ts` module.
*   The main ingestion script could be a tRPC procedure or a standalone script.

### References
*   [Source: docs/epics.md#Epic-2]
*   [Source: docs/PRD.md#FR010]
*   [Source: docs/architecture.md#Integration-Points]

## Dev Agent Record

### Context Reference
- docs/sprint-artifacts/2-2-data-ingestion-and-indexing-from-canvas.context.xml

### Agent Model Used
{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List

## Change Log
- 2025-11-28: Initial draft created.
