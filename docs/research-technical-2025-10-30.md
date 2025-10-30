# Technical Research Report: Course-FAQ Chatbot

## 1. Executive Summary

This report details the technical research conducted for the "Course-FAQ Chatbot" project, aimed at providing students with quick access to course information and reducing teacher workload. The primary objective was to identify a robust, scalable, and secure technology stack that aligns with the project's functional and non-functional requirements, while prioritizing security, performance, and developer productivity.

The recommended technology stack comprises **React 18 with Tailwind CSS for the frontend, Node.js for the backend, Supabase as the primary Backend-as-a-Service (including PostgreSQL, Auth, Realtime, and Edge Functions), Pinecone as the dedicated vector database, REST API for inter-service communication, and OAuth 2.0 for authentication, all orchestrated around a Retrieval-Augmented Generation (RAG) pattern for AI functionality.** This stack offers a strong foundation for security, high performance, and efficient development, directly addressing the core needs of the chatbot.

## 2. Requirements and Constraints

### Functional Requirements:
*   User authentication, specifically with school accounts.
*   Ability to link to important course information (Syllabus, course info, deadlines).
*   Provide concise answers to simple user questions.
*   Ensure the chatbot always works with updated information.
*   Guide users to contact teachers using their preferred communication methods.
*   All communication must be encrypted.
*   No personal information is to be stored.
*   Connect to Canvas to pull information.
*   AI must be bilingual and capable of interpreting materials that often contain English terms.
*   AI must have single session context availability.
*   Teachers must be able to upload text documents and presentations to update the chatbot's knowledge base.

### Non-Functional Requirements:
*   Encrypted data transfer.
*   Compliance with privacy laws like GDPR.
*   Chatbot uptime exceeding 90% during the semester.
*   User questions answered within one minute.
*   Accuracy target for success criteria (e.g., "90% of answers rated helpful by users").
*   Implementation of user feedback mechanisms (thumbs up/down).

### Constraints:
*   The project must be web-based.
*   Hosting: local.
*   Frontend technology: React 18 and Tailwind.
*   Backend technology: Node.js.
*   Database: Supabase.
*   Authentication: OAuth 2.0.
*   API design: REST API.
*   Vector database: Pinecone.
*   Users should only be able to access courses they are enrolled in.
*   The system must be online to access the newest information for the course.
*   The chatbot must always answer with sources.
*   A plan for handling incorrect answers must be in place, including warnings about potential inaccuracy and advising users to double-check answers.

## 3. Technology Options (Evaluated Candidates)

The following technologies were evaluated as per the project proposal:

*   **Frontend:** React 18
*   **Styling:** Tailwind CSS
*   **Backend Runtime:** Node.js
*   **Backend-as-a-Service (BaaS) / Database:** Supabase
*   **Authentication Protocol:** OAuth 2.0
*   **API Architectural Style:** REST API
*   **Vector Database:** Pinecone

## 4. Detailed Profiles (Deep Dive on Each Option)

### Technology Profile: React 18

*   **Overview:** JavaScript library for building UIs, focusing on performance and developer experience with concurrent rendering.
*   **Technical Characteristics:** Concurrent React, Automatic Batching, React Server Components (RSC), Improved Suspense, Transitions.
*   **Developer Experience:** Gradual adoption, new APIs/Hooks, stricter Strict Mode, reduced boilerplate.
*   **Operations:** Enhanced performance, SSR improvements, React Native integration.
*   **Ecosystem:** Vast with frameworks (Next.js), UI libraries, and tools.
*   **Community and Adoption:** Large, active community, widespread adoption.
*   **Costs:** Free (open-source), but migration effort for new features, potential performance costs if not optimized, learning curve.

### Technology Profile: Tailwind CSS

*   **Overview:** Utility-first CSS framework for rapid web development, providing single-purpose CSS classes.
*   **Technical Characteristics:** Utility-first, high customization, responsive design with modifiers, performance optimization (tree-shaking), modern CSS features, directives.
*   **Developer Experience:** Rapid development, intuitive class names, good IDE support, learning curve for utility classes.
*   **Operations:** Integrates into build process for optimized CSS, uses PostCSS.
*   **Ecosystem:** UI libraries built on Tailwind, seamless framework integration, plugins.
*   **Community and Adoption:** Significant popularity, large active community, high satisfaction.
*   **Costs:** Free (open-source), potential costs for paid UI kits.

### Technology Profile: Node.js

*   **Overview:** Open-source, cross-platform JavaScript runtime for server-side and command-line execution, leveraging Google's V8 engine.
*   **Technical Characteristics:** Event-driven architecture, single-threaded event loop, non-blocking I/O, `libuv`, rich core modules, native JS/TS support, multi-core utilization via `cluster`.
*   **Developer Experience:** Streamlined with "JavaScript everywhere," access to new ECMAScript, vast npm ecosystem, frameworks (Express.js, Next.js).
*   **Operations:** Scalable for network applications (real-time), suitable for microservices, cross-platform deployment. Less ideal for CPU-intensive tasks.
*   **Ecosystem:** Extensive and vibrant, centered around npm, numerous web frameworks and built-in modules.
*   **Community and Adoption:** Large, active, global community, one of the most used web technologies.
*   **Costs:** Free (open-source), development/hiring costs vary, can be cost-effective due to unified language.

### Technology Profile: Supabase

*   **Overview:** Open-source Backend-as-a-Service (BaaS), an alternative to Firebase, built around PostgreSQL.
*   **Technical Characteristics:** PostgreSQL database (full SQL, `pgvector`), real-time capabilities (WebSockets), built-in JWT-based authentication (GoTrue, social logins, RLS integration), S3-compatible storage, Edge Functions (serverless), auto-generated RESTful APIs (PostgREST), GraphQL API (`pg_graphql`).
*   **Developer Experience:** Intuitive dashboard, automatic API generation, client libraries for various platforms, local development CLI, in-built SQL editor.
*   **Operations:** Managed service, designed for scalability and high availability, daily backups, log retention, strong security features (RLS, MFA, SSO, encryption).
*   **Ecosystem, Community, and Adoption:** Vibrant open-source ecosystem, community support, integrations with modern stacks, growing adoption for AI applications.
*   **Costs:** Tiered pricing (Free, Pro, Team, Enterprise), usage-based billing, potential egress costs.

### Technology Profile: OAuth 2.0

*   **Overview:** Industry-standard authorization framework for delegated access without sharing user credentials.
*   **Technical Characteristics:** Defines roles (Resource Owner, Client, Resource Server, Authorization Server), Access Tokens (often JWT), Refresh Tokens, Scopes, various Grant Types (Authorization Code, Implicit, Client Credentials, Resource Owner Password). Requires TLS.
*   **Developer Experience:** Simplified authorization flow, numerous libraries/tools, OIDC for authentication.
*   **Operations:** Requires best practices for security, secure handling of tokens, token revocation, consent screens.
*   **Ecosystem:** Extensive, with OIDC built on top, widely adopted by major tech companies.
*   **Community and Adoption:** Industry standard, published RFCs, continuously evolving (OAuth 2.1).
*   **Costs:** Free (open standard), but development/integration costs, infrastructure for auth servers, third-party IAM services.

### Technology Profile: REST API

*   **Overview:** Architectural style for web services, enabling communication and data exchange via HTTP requests/responses.
*   **Technical Characteristics:** Client-Server, Statelessness, Cacheability, Uniform Interface, Layered System, Resource-Based (URIs), standard HTTP Methods (GET, POST, PUT, PATCH, DELETE), JSON data format.
*   **Developer Experience:** Good documentation (OpenAPI/Swagger), SDKs, ease of onboarding, consistency, tooling (Postman).
*   **Operations:** Security (HTTPS, OAuth), authentication/authorization, monitoring, versioning, API management platforms.
*   **Ecosystem, Community, and Adoption:** Widespread adoption across industries, standard for microservices, large community support.
*   **Costs:** Free (architectural style), but infrastructure, development/maintenance, security, API management platform costs.

### Technology Profile: Pinecone

*   **Overview:** Cloud-native vector database for efficient storage, indexing, and querying of high-dimensional vector data, providing long-term memory for AI.
*   **Technical Characteristics:** Vector data handling (embeddings), managed service architecture (Pods, Serverless), data organization (indexes, namespaces), search capabilities (real-time indexing, hybrid search, metadata filters).
*   **Developer Experience:** User-friendly API, SDKs, comprehensive documentation.
*   **Operations:** Fully managed service (scaling, updates, monitoring), enterprise-grade scalability, real-time data ingestion.
*   **Ecosystem:** Significant role in AI/ML (semantic search, RAG, NLP), integrates with LLMs, competitors like Weaviate, Qdrant.
*   **Community and Adoption:** Growing community, industry leader in vector databases.
*   **Costs:** Tiered pricing (Free, Paid), usage-based, minimum monthly charges, aims for predictable pricing.

## 5. Comparative Analysis

| Feature / Technology | React 18 (Frontend) | Tailwind CSS (Styling) | Node.js (Backend) | Supabase (DB/BaaS) | OAuth 2.0 (Auth) | REST API (API Design) | Pinecone (Vector DB) |
| :------------------- | :------------------ | :--------------------- | :---------------- | :----------------- | :--------------- | :-------------------- | :------------------- |
| **1. Meets Requirements** | 5 (Excellent) | 5 (Excellent) | 5 (Excellent) | 5 (Excellent) | 5 (Excellent) | 5 (Excellent) | 5 (Excellent) |
| **2. Performance** | 4 (High) | 5 (Excellent) | 4 (High) | 4 (High) | 4 (High) | 4 (High) | 5 (Excellent) |
| **3. Scalability** | 4 (High) | 5 (Excellent) | 4 (High) | 4 (High) | 4 (High) | 4 (High) | 5 (Excellent) |
| **4. Complexity** | 3 (Medium) | 2 (Low) | 3 (Medium) | 3 (Medium) | 4 (Medium-High) | 2 (Low) | 3 (Medium) |
| **5. Ecosystem** | 5 (Excellent) | 5 (Excellent) | 5 (Excellent) | 4 (High) | 5 (Excellent) | 5 (Excellent) | 4 (High) |
| **6. Cost** | Free (Open-source) | Free (Open-source) | Free (Open-source) | Tiered (Free to Enterprise) | Free (Open Standard) | Free (Architectural Style) | Tiered (Free to Enterprise) |
| **7. Risk** | 2 (Low) | 1 (Very Low) | 2 (Low) | 3 (Medium) | 2 (Low) | 1 (Very Low) | 3 (Medium) |
| **8. Developer Experience** | 4 (Good) | 4 (Good) | 4 (Good) | 4 (Good) | 3 (Medium) | 4 (Good) | 4 (Good) |
| **9. Operations** | 4 (Good) | 5 (Excellent) | 4 (Good) | 4 (Good) | 4 (Good) | 4 (Good) | 5 (Excellent) |
| **10. Future-Proofing** | 4 (Good) | 4 (Good) | 4 (Good) | 4 (Good) | 5 (Excellent) | 5 (Excellent) | 4 (Good) |

## 6. Trade-off Analysis and Decision Factors

**Top 3 Decision Factors:**

1.  **Security and Compliance:** Critical for handling student data and adhering to privacy regulations like GDPR.
2.  **Performance and Reliability:** Essential for a responsive chatbot experience, quick answer times, and high system uptime.
3.  **Developer Productivity and Maintainability:** To ensure efficient development, rapid iteration, and long-term sustainability of the application.

**Weighted Analysis Summary:**

The proposed stack aligns strongly with these decision factors. Supabase and OAuth 2.0 directly address Security and Compliance. All technologies contribute positively to Performance and Reliability. React, Tailwind, Node.js, Supabase, and Pinecone offer strong developer experience and ecosystems, boosting Developer Productivity and Maintainability. Key trade-offs include potential vendor lock-in for managed services and the inherent complexity of correctly implementing security protocols, which are acceptable given the benefits for a greenfield project.

## 7. Real-World Evidence

*   **Unified JavaScript Stack (React + Node.js):** Highly favored for streamlined development, reduced context switching, and code sharing.
*   **Managed Services (Supabase, Pinecone):** Reduce operational overhead but introduce vendor lock-in and require careful cost management.
*   **Supabase with `pgvector` vs. Pinecone:**
    *   `pgvector` is cost-effective and integrated for relational data + vector search.
    *   Pinecone offers superior low-latency performance for large-scale, performance-critical vector searches. The choice is strategic based on scale and performance needs.
*   **Integration Complexity:** Real-time AI components require careful planning for low-latency memory layers and efficient context retrieval.
*   **Best Practices:** Strategic tool selection, planned migrations, AI-assisted development, Backend for Frontend (BFF) pattern, modular architecture, thorough testing, and comprehensive documentation are crucial lessons learned from production environments.

## 8. Recommendations

The recommendation is to proceed with the proposed technology stack: **React 18, Tailwind CSS, Node.js, Supabase, Pinecone, REST API, and OAuth 2.0, implementing a Retrieval-Augmented Generation (RAG) pattern.** This stack is optimized for the chatbot's requirements, balancing security, performance, and development efficiency.

## 9. Architecture Decision Record

```markdown
# ADR-001: Adopt React, Node.js, Supabase, Pinecone for Course-FAQ Chatbot

## Status

Proposed

## Context

The project aims to develop a "Course-FAQ Chatbot" to assist students in finding assignment information, deadlines, and course content, and to reduce repetitive questions for teachers. The solution requires a modern, interactive web application with robust backend services, secure user authentication, efficient data management, and advanced AI capabilities for natural language understanding and information retrieval. Key requirements include GDPR compliance, high performance, scalability, and developer productivity.

## Decision Drivers

*   **Security and Compliance:** Critical for handling student data and adhering to privacy regulations like GDPR.
*   **Performance and Reliability:** Essential for a responsive chatbot experience, quick answer times, and high system uptime.
*   **Developer Productivity and Maintainability:** To ensure efficient development, rapid iteration, and long-term sustainability of the application.
*   **AI Capabilities:** The need for accurate, context-aware answers based on course documents, requiring advanced semantic search.
*   **Greenfield Project:** Opportunity to leverage modern, cloud-native, and developer-friendly technologies.

## Considered Options

1.  **Proposed Stack (Chosen):** React 18 (Frontend), Tailwind CSS (Styling), Node.js (Backend), Supabase (Database/BaaS), Pinecone (Vector Database), OAuth 2.0 (Authentication), REST API (API Design), Retrieval-Augmented Generation (RAG) Pattern.
2.  **Alternative Vector Database:** Supabase `pgvector` instead of Pinecone.
3.  **Alternative Backend Framework:** Express.js (with Node.js) for more granular control.
4.  **Alternative Authentication:** Firebase Authentication.

## Decision

The decision is to adopt the proposed technology stack: **React 18 with Tailwind CSS for the frontend, Node.js for the backend, Supabase as the primary Backend-as-a-Service (including PostgreSQL, Auth, Realtime, and Edge Functions), Pinecone as the dedicated vector database, REST API for inter-service communication, and OAuth 2.0 for authentication, all orchestrated around a Retrieval-Augmented Generation (RAG) pattern for AI functionality.**

## Consequences

**Positive:**

*   **Enhanced Security & Compliance:** Supabase's built-in features (RLS, MFA, encryption) and OAuth 2.0 provide a strong foundation for data protection and GDPR adherence.
*   **High Performance & Responsiveness:** The combination of React 18's concurrent rendering, Tailwind's optimized CSS, Node.js's efficient I/O, Supabase's managed scalability, and Pinecone's specialized vector search ensures a fast and fluid user experience.
*   **Accelerated Development & Maintainability:** The unified JavaScript ecosystem, managed services, and well-understood architectural patterns will boost developer productivity and simplify long-term maintenance.
*   **Accurate & Contextual AI:** The RAG pattern with Pinecone enables the chatbot to provide highly relevant and grounded answers from course materials, significantly reducing hallucinations.
*   **Scalability:** The cloud-native and managed services are designed to scale with user demand and data volume.

**Negative:**

*   **Potential Vendor Lock-in:** Reliance on managed services like Supabase and Pinecone introduces some degree of vendor lock-in.
*   **Cost Management:** Usage-based pricing for Supabase and Pinecone requires careful monitoring to prevent unexpected cost escalations, especially at high scale.
*   **Complexity of OAuth 2.0:** While standard, correct and secure implementation of OAuth 2.0 flows can be complex and requires expertise.

**Neutral:**

*   **Learning Curve:** While developer-friendly, new team members will need to familiarize themselves with the specific nuances of each technology, particularly the RAG pattern and vector databases.

## Implementation Notes

*   Prioritize secure configuration of Supabase RLS and OAuth 2.0.
*   Develop a robust data ingestion pipeline for course documents, including embedding generation and indexing into Pinecone.
*   Implement comprehensive monitoring for performance and cost tracking across all services.
*   Leverage Supabase Edge Functions for custom backend logic where appropriate to maintain the BaaS benefits.
*   Continuously refine the RAG pipeline through prompt engineering and feedback mechanisms to optimize answer quality.

## References

*   `proposal.md` (User requirements and initial technology suggestions)
*   Technical Research Report (Detailed analysis of each technology, comparative analysis, trade-offs, real-world evidence, and architectural patterns)
```

## 10. Next Steps (Implementation Roadmap)

1.  **Phase 1: Setup & Core Infrastructure (Weeks 1-2)**
    *   Initialize React project with Tailwind CSS.
    *   Set up Supabase project (database schema, authentication, RLS policies).
    *   Configure Node.js backend for API endpoints and integration with Supabase.
    *   Integrate Pinecone (create index, define schema).
    *   Set up OAuth 2.0 for school email authentication.
    *   Implement basic user authentication flow.

2.  **Phase 2: Data Ingestion & RAG Pipeline (Weeks 3-5)**
    *   Develop data ingestion pipeline for course documents (teachers uploading files).
    *   Implement text extraction and chunking from documents.
    *   Integrate an embedding model to convert text chunks into vectors.
    *   Upsert vectors into Pinecone.
    *   Develop the core RAG pipeline:
        *   User query -> Embed query -> Pinecone search -> Retrieve relevant document chunks.
        *   Combine chunks with query -> Send to LLM -> Generate answer.
    *   Implement basic chatbot UI in React.

3.  **Phase 3: Chatbot Functionality & Refinements (Weeks 6-8)**
    *   Implement conversational context management for the AI.
    *   Integrate Canvas API for pulling course information.
    *   Develop features for guiding users to teacher communication.
    *   Implement bilingual AI capabilities.
    *   Add user feedback mechanisms (thumbs up/down).
    *   Refine UI/UX for student and teacher flows.

4.  **Phase 4: Testing, Security & Deployment (Weeks 9-10)**
    *   Comprehensive testing (unit, integration, end-to-end).
    *   Security audits and penetration testing.
    *   Performance testing and optimization.
    *   Deployment to local hosting environment.
    *   Monitoring and logging setup.

---

**✅ Technical Research Complete**

**Research Report:**

- Technical research report generated and saved to `C:\Users\jaske\github\SG-Polse\docs\research-technical-2025-10-30.md`

**Status file updated:**

- Current step: research (technical) ✓
- Progress: {{new_progress_percentage}}%

**Next Steps:**

- **Next required:** brainstorm-project (analyst agent)
- **Optional:** Review findings with architecture team, or run additional analysis workflows

Check status anytime with: `workflow-status`
```