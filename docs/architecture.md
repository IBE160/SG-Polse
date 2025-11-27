# Architecture

## Executive Summary

The architecture is a modern, type-safe, full-stack application built on the T3 Stack. It leverages Next.js for the frontend and backend, with tRPC for type-safe API communication. Supabase provides the PostgreSQL database, authentication, and file storage, creating a simplified and integrated backend. Deployment will be handled by Vercel for a seamless CI/CD experience.

## Project Context
I'm reviewing your project documentation for ibe160.
I see 3 epics with 16 total stories. I also found your UX specification which defines the user experience requirements.

Key aspects I notice:
- The core functionality revolves around a Course-FAQ Chatbot for students, with teachers managing content.
- Critical Non-Functional Requirements include high uptime (90%), fast response times (within one minute), strong encryption, and GDPR compliance.
- The UX involves a card-based conversational UI, aims for WCAG 2.1 Level AA accessibility, and is desktop-responsive.
- Unique challenges include bilingual interpretation and integration with Canvas LMS and Pinecone vector database.

## Starter Template Decision

Based on the project requirements for a full-stack web application with React, the T3 Stack was selected as the foundational starter template.

**Rationale:** The T3 stack provides a robust, type-safe, and scalable foundation that aligns well with the project's needs. It includes Next.js, TypeScript, tRPC, Prisma, and Tailwind CSS, which directly support the requirements for a React-based frontend, a secure backend API, database interaction, and the specified styling solution. Using this starter accelerates development by providing a pre-configured setup with best practices.

**Initialization Command:**
The project should be initialized with the following command, which will be the first story of implementation:
```bash
npm create t3-app@latest <your-project-name>
```
During the interactive setup, the following options should be selected to align with the project requirements:
- Next.js
- Tailwind CSS
- tRPC
- Prisma
- NextAuth.js

**Architectural Decisions Provided by Starter:**
- **Language:** TypeScript
- **Framework:** Next.js (React)
- **API:** tRPC
- **Database ORM:** Prisma
- **Authentication:** NextAuth.js
- **Styling:** Tailwind CSS
- **Linting/Formatting:** ESLint & Prettier
- **Project Structure:** T3 standard monorepo-like structure.

### Decision Plan

Based on the project requirements, several key architectural decisions need to be made. The chosen starter template (T3 Stack) has already made several of these for us, which is a great head start.

**Decisions already made by the T3 Starter:**
- **Language:** TypeScript
- **Framework:** Next.js (React)
- **API:** tRPC
- **Authentication:** NextAuth.js
- **Styling:** Tailwind CSS

**Remaining Decisions:**
We will now walk through the remaining decisions, focusing on the most critical ones first.

**Priority Order:**
1.  **Critical Decisions:**
    -   Database (Data Persistence)
    -   Deployment Target (Hosting)
2.  **Important Decisions:**
    -   File Storage
    -   Email Service
3.  **Future Considerations (can be deferred):**
    -   Background Jobs
    -   Full-Text Search

## Decision Summary

| Category | Decision | Version | Affects Epics | Rationale |
| -------- | -------- | ------- | ------------- | --------- |

| Data Persistence | Supabase (PostgreSQL) | 2.86.0 | All Epics | Provides a robust PostgreSQL database with integrated authentication and file storage, simplifying the architecture and accelerating development. |

| Deployment Target | Vercel | N/A | All Epics | Provides a seamless, zero-configuration deployment experience for Next.js applications, enabling rapid, continuous deployment. |

| File Storage | Supabase Storage | 2.86.0 | Epic 3 | Simplifies the architecture by co-locating file storage with the database and auth layers, integrating well with the chosen stack. |

| Email Service | Resend | 6.5.2 | Epic 1 | A modern, developer-friendly email service with a generous free tier and excellent integration with React, ideal for transactional emails. |



## Project Structure

```
{{project_root}}/
The project will follow the standard T3 App folder structure, which is designed for full-stack, type-safe applications.

/
├── public/                  # Static assets
├── src/
│   ├── app/                 # Next.js App Router: pages, layouts, route handlers
│   │   ├── api/
│   │   │   └── trpc/
│   │   │       └── [trpc]/  # tRPC API single endpoint
│   │   ├── _components/     # Shared, non-page components
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Root page
│   ├── env.mjs              # Environment variable validation
│   ├── server/
│   │   ├── api/
│   │   │   ├── root.ts      # tRPC root router
│   │   │   └── routers/     # tRPC routers for different resources
│   │   ├── auth.ts          # NextAuth.js configuration
│   │   └── db/
│   │       └── index.ts     # Prisma client initialization
│   └── styles/
│       └── globals.css      # Global Tailwind CSS styles
├── prisma/
│   └── schema.prisma        # Prisma schema for database models
├── .env                     # Environment variables (gitignored)
├── next.config.mjs          # Next.js configuration
└── package.json             # Project dependencies and scripts
```

## Epic to Architecture Mapping

| Epic | Architectural Boundary | Components |
|------|------------------------|------------|
| 1. Project Foundation & User Authentication | `src/server/auth.ts`, `src/app/api/auth/**`, Supabase Auth | Authentication logic, user session management, database models for users. |
| 2. Core Chatbot Functionality & Info Retrieval | `src/server/api/routers/`, `src/app/_components/`, Canvas & Pinecone APIs | tRPC routers for chatbot queries, React components for the chat interface, external API clients. |
| 3. Teacher Content Management | `src/server/api/routers/`, `src/app/_components/`, Supabase Storage | tRPC routers for file uploads, React components for the teacher dashboard, storage service integration. |

## Technology Stack Details

### Core Technologies

The technology stack is centered around the T3 Stack, which includes: Next.js (v14+), React (v18+), TypeScript, tRPC, Prisma, and Tailwind CSS. This is augmented by Supabase for the backend (PostgreSQL, Auth, Storage), Resend for email, and Pino for logging.

### Integration Points

- **Canvas LMS:** An API client will be created to fetch course data. This will likely live in a dedicated `src/server/services/canvas.ts` module.
- **Pinecone:** A service client will be created to interact with the Pinecone vector database for indexing and querying. This will likely live in `src/server/services/pinecone.ts`.
- **Supabase:** The Prisma client will manage database interactions. The Supabase client library will handle authentication and file storage.
- **Resend:** An email service client will be created, likely in `src/server/services/email.ts`, to handle sending transactional emails via the Resend API.

No novel architectural patterns were required for this project. The requirements can be met using established, industry-standard patterns for full-stack web applications.

## Implementation Patterns

These patterns ensure consistent implementation across all AI agents:

To ensure consistency across all AI agents, the following implementation patterns MUST be followed.

### Naming Conventions
- **Database Tables:** `PascalCase`, singular (e.g., `User`, `Course`). As per Prisma convention.
- **Database Columns:** `camelCase` (e.g., `userId`, `courseName`). As per Prisma convention.
- **Components:** `PascalCase` for file and component names (e.g., `UserCard.tsx`).
- **Variables & Functions:** `camelCase`.
- **CSS Classes:** Use Tailwind CSS utility classes directly. Do not create custom CSS classes unless absolutely necessary.

### Code Organization
- **Component Structure:** Components should be organized by feature within the `src/app/_components/` directory. For example, all components related to the chatbot interface should reside in `src/app/_components/chatbot/`.
- **Testing:** Test files should be co-located with the source files they are testing (e.g., `MyComponent.tsx` and `MyComponent.test.tsx` in the same folder).
- **Services:** Clients for external APIs (Canvas, Pinecone, etc.) should be placed in the `src/server/services/` directory.

### State Management
- **Server State:** `React Query` (provided by the T3 stack) MUST be used for all server state management (fetching, caching, updating data).
- **Client State:** For simple global UI state (e.g., theme, modal open/close), use `Zustand`. For local component state, use React's built-in `useState` and `useReducer` hooks.

### API Communication
- All communication between the frontend and backend MUST go through the `tRPC` API. Direct calls to the database from the frontend are forbidden.

### Error & Loading States
- **Loading States:** Components that fetch data MUST display a loading state (e.g., a skeleton loader or spinner) using the `isLoading` flag from React Query.
- **Error States:** Components MUST gracefully handle and display errors using the `isError` flag from React Query, showing a user-friendly error message.

## Testing Strategy
A pragmatic testing approach will be used, focusing on a balance of speed and confidence.
- **Unit Tests:** Jest and React Testing Library will be used for unit testing critical UI components and business logic.
- **Integration Tests:** Integration tests will be written for tRPC API procedures to ensure they interact with the database (Prisma/Supabase) correctly.
- **End-to-End (E2E) Tests:** Cypress or Playwright can be added later if the complexity of user flows warrants it, but it is out of scope for the initial MVP.

## Consistency Rules

### Naming Conventions



### Date/Time Handling
- **Library:** `date-fns` will be used for all date and time manipulations. It is lightweight, modular, and provides consistent, reliable functions.
- **Format:** All dates sent to/from the API will be in ISO 8601 format (e.g., `2025-11-27T15:36:00.000Z`). All dates stored in the database will be UTC timestamps.

### Code Organization



### Error Handling

- **API Errors:** tRPC will be used to provide type-safe errors from the backend to the frontend. All API procedures should handle exceptions gracefully and return structured errors.
- **UI Errors:** A global error boundary will be implemented in React to catch and handle unexpected frontend errors, preventing the entire app from crashing. User-facing error messages will be displayed using a consistent toast/notification component as defined in the UX spec.

### Logging Strategy

- **Strategy:** We will use a simple, structured logging approach.
- **Server-side:** Pino will be used for low-overhead, structured JSON logging on the server (Next.js backend). Logs will include a timestamp, level (info, warn, error), and a message.
- **Client-side:** Console logging will be used during development. For production, we can integrate a service like Vercel Logs (which is automatic) or a third-party logging service if needed in the future.

## Data Architecture

The data model will be defined in the `schema.prisma` file. Key models will include `User`, `Course`, `Document`, and potentially others to represent chatbot context and teacher uploads. Relations will be defined to link users to courses and documents to courses.

## API Contracts

API contracts are managed automatically by tRPC. It ensures end-to-end type safety between the backend and frontend without the need for a separate specification like OpenAPI. API procedures will be organized by resource in `src/server/api/routers/`.

## Security Architecture

Security is managed at multiple layers. NextAuth.js combined with Supabase Auth provides secure user authentication. All communication is over HTTPS. Prisma helps prevent SQL injection. Permissions for data access and file uploads will be enforced in the tRPC procedures based on user roles.

## Performance Considerations

Performance will be addressed through Next.js's server-side rendering (SSR) and static site generation (SSG) capabilities, React Query's caching, and Vercel's global CDN. Image optimization will be handled by Next.js's built-in Image component.

## Deployment Architecture

The application will be deployed to Vercel. Every push to the `main` branch will trigger an automatic build and deployment. Environment variables for Supabase, Resend, and other services will be managed securely in the Vercel project settings.

## Development Environment

### Prerequisites

Node.js (v20+), npm, and a Supabase account.

### Setup Commands

```bash
1. Clone the repository.
2. Install dependencies: `npm install`
3. Set up your local `.env` file with credentials from your Supabase project.
4. Run Prisma migrations: `npx prisma db push`
5. Start the development server: `npm run dev`
```

## Architecture Decision Records (ADRs)

### 1. Data Persistence: Supabase (PostgreSQL)

- **Context:** The application requires a database to store user accounts, course information, and other application data.
- **Decision:** We will use Supabase as the backend platform, which utilizes PostgreSQL as its database.
- **Rationale:** Supabase provides a powerful and reliable PostgreSQL database while also bundling other key features needed for this project, including authentication and file storage. This significantly simplifies the architecture, reduces the number of external services, and accelerates development time. The Prisma ORM provided by the T3 starter has strong support for PostgreSQL.
- **Version:** The `@supabase/supabase-js` client library will be used, version `2.86.0` or later.

### 2. Deployment Target: Vercel

- **Context:** The application needs to be hosted on a reliable, scalable, and easy-to-use platform.
- **Decision:** We will use Vercel for hosting and deployment.
- **Rationale:** As the creators of Next.js, Vercel offers the most integrated and optimized hosting solution for our chosen T3 stack. It provides features like automatic deployments on git push (Continuous Deployment), serverless functions for our tRPC API, and a global CDN, which are ideal for a high-performance, modern web application.
- **Version:** N/A (Platform)

### 3. File Storage: Supabase Storage

- **Context:** The application requires a secure and reliable location to store documents uploaded by teachers.
- **Decision:** We will use the integrated Supabase Storage for all file uploads.
- **Rationale:** Since Supabase is already part of our stack for the database, using its built-in storage solution is the most efficient choice. It simplifies our architecture, reduces complexity by avoiding another cloud provider, and leverages the same authentication and security policies, making it easier to manage permissions.
- **Version:** Included with `@supabase/supabase-js` v2.86.0 or later.

### 4. Email Service: Resend

- **Context:** The application needs to send transactional emails for features like user account verification (Story 1.3).
- **Decision:** We will use Resend for sending all transactional emails.
- **Rationale:** Resend is a modern email platform designed for developers. Its ease of use, generous free tier, and strong integration with the React ecosystem (especially via the `react-email` library) make it an excellent choice for our stack. This allows for sending reliable and good-looking emails with minimal configuration.
- **Version:** The `resend` npm package will be used, version `6.5.2` or later.



---

_Generated by BMAD Decision Architecture Workflow v1.0_
_Date: {{date}}_
_For: {{user_name}}_
