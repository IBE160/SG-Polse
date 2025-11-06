# ibe160 - Epic Breakdown

**Author:** BIP
**Date:** 2025-11-06
**Project Level:** 3
**Target Scale:** Standard

---

## Overview

This document provides the detailed epic breakdown for ibe160, expanding on the high-level epic list in the [PRD](./PRD.md).

Each epic includes:

- Expanded goal and value proposition
- Complete story breakdown with user stories
- Acceptance criteria for each story
- Story sequencing and dependencies

**Epic Sequencing Principles:**

- Epic 1 establishes foundational infrastructure and initial functionality
- Subsequent epics build progressively, each delivering significant end-to-end value
- Stories within epics are vertically sliced and sequentially ordered
- No forward dependencies - each story builds only on previous work

---

## Epic 1: Project Foundation & User Authentication

**Expanded Goal:** This epic aims to establish the fundamental technical infrastructure for the Course-FAQ Chatbot, including repository setup, CI/CD pipelines, and initial deployment capabilities. Concurrently, it will implement a robust and secure user authentication system, allowing students and teachers to securely access the application using their school accounts, thereby laying the groundwork for all subsequent features.

**Story Breakdown:**

*   **Story 1.1: Initialize Project Repository & Basic CI/CD**
    *   As a developer, I want to set up the project repository and a basic CI/CD pipeline, so that development can begin with automated testing and deployment processes.
    *   **Acceptance Criteria:**
        1.  Git repository is initialized and configured.
        2.  Basic CI/CD pipeline is set up for automated builds and tests.
        3.  A simple "Hello World" web page can be deployed via the CI/CD pipeline.
    *   **Prerequisites:** None

*   **Story 1.2: User Registration with School Email**
    *   As a new user, I want to register for the chatbot using my school email and password, so that I can create an account linked to my academic institution.
    *   **Acceptance Criteria:**
        1.  User can access a registration page.
        2.  User can input school email and password.
        3.  System sends a verification email to the provided school email address.
        4.  User receives a confirmation of successful registration.
    *   **Prerequisites:** Story 1.1

*   **Story 1.3: Email Verification & Account Activation**
    *   As a new user, I want to verify my email address by clicking a link, so that my account can be activated and I can log in.
    *   **Acceptance Criteria:**
        1.  Verification email contains a unique, time-limited link.
        2.  Clicking the link activates the user's account.
        3.  User is redirected to a login page or a success message after verification.
        4.  Unverified accounts cannot log in.
    *   **Prerequisites:** Story 1.2

*   **Story 1.4: User Login with OAuth 2.0**
    *   As a registered user, I want to log in to the chatbot using OAuth 2.0 with my school credentials, so that I can securely access my account.
    *   **Acceptance Criteria:**
        1.  User can access a login page.
        2.  User can initiate OAuth 2.0 flow with school identity provider.
        3.  Successful authentication redirects user to the application dashboard.
        4.  Failed authentication displays an appropriate error message.
    *   **Prerequisites:** Story 1.3

*   **Story 1.5: Role-Based Access Control (Student/Teacher)**
    *   As an authenticated user, I want the system to recognize my role (student or teacher), so that I am granted appropriate access and permissions within the application.
    *   **Acceptance Criteria:**
        1.  System identifies user role upon successful login.
        2.  Students are directed to the course selection view.
        3.  Teachers are directed to their course management/upload view.
        4.  Unauthorized role access attempts are prevented.
    *   **Prerequisites:** Story 1.4

## Epic 2: Core Chatbot Functionality & Information Retrieval

**Expanded Goal:** This epic focuses on implementing the central intelligence and interaction mechanisms of the chatbot. It will enable the chatbot to connect to the Canvas LMS, retrieve relevant course information, process user queries, and provide concise, sourced answers, thereby delivering the primary value proposition to students.

**Story Breakdown:**

*   **Story 2.1: Canvas LMS Integration for Course Data**
    *   As a system administrator, I want the chatbot to securely connect to the Canvas LMS, so that it can access course information like syllabi, assignments, and deadlines for IBE160.
    *   **Acceptance Criteria:**
        1.  Chatbot successfully establishes a secure connection to Canvas LMS.
        2.  System can retrieve a list of courses and their associated documents (e.g., syllabus, assignment descriptions).
        3.  Authentication with Canvas is handled securely.
    *   **Prerequisites:** Epic 1 (Authentication)

*   **Story 2.2: Data Ingestion and Indexing from Canvas**
    *   As a system, I want to ingest and index course documents from Canvas into a vector database (Pinecone), so that the chatbot can efficiently search and retrieve information.
    *   **Acceptance Criteria:**
        1.  System can parse various document formats (e.g., PDF, DOCX, TXT) from Canvas.
        2.  Content from documents is extracted and converted into embeddings.
        3.  Embeddings are stored in Pinecone for efficient retrieval.
        4.  A mechanism exists to re-index updated documents from Canvas.
    *   **Prerequisites:** Story 2.1

*   **Story 2.3: Chatbot User Interface (Student View)**
    *   As a student, I want to interact with a clear and intuitive chatbot interface, so that I can easily ask questions and receive answers.
    *   **Acceptance Criteria:**
        1.  A web-based chat interface is available for authenticated students.
        2.  Students can type questions into a text input field.
        3.  Chatbot responses are displayed clearly in the interface.
        4.  The interface is responsive and user-friendly.
    *   **Prerequisites:** Epic 1 (Authentication)

*   **Story 2.4: Natural Language Understanding & Response Generation**
    *   As a student, I want the chatbot to understand my questions and generate concise, relevant answers, so that I can quickly get the information I need.
    *   **Acceptance Criteria:**
        1.  Chatbot can process natural language queries.
        2.  Chatbot generates answers based on indexed course data.
        3.  Answers are concise and directly address the user's question.
        4.  Chatbot maintains single-session context for follow-up questions within the same session.
    *   **Prerequisites:** Story 2.2, Story 2.3

*   **Story 2.5: Answer Sourcing and Citation**
    *   As a student, I want the chatbot to provide sources for its answers, so that I can verify the information and delve deeper if needed.
    *   **Acceptance Criteria:**
        1.  Every chatbot answer includes a clear citation to the source document (e.g., "Source: Syllabus, Page 3").
        2.  Citations are accurate and link to the relevant part of the document if possible.
    *   **Prerequisites:** Story 2.4

*   **Story 2.6: Bilingual Interpretation (English Terms)**
    *   As a student, I want the chatbot to accurately interpret questions that contain English terms within another language, so that I can ask questions naturally.
    *   **Acceptance Criteria:**
        1.  Chatbot successfully identifies and processes English terms embedded in non-English queries.
        2.  Responses are generated based on the correct interpretation of the mixed-language query.
    *   **Prerequisites:** Story 2.4

*   **Story 2.7: Guidance for Teacher Contact**
    *   As a student, if the chatbot cannot answer my question, I want it to guide me on how to contact my teacher, so that I can get further assistance.
    *   **Acceptance Criteria:**
        1.  When the chatbot cannot provide an answer, it offers clear instructions on teacher contact methods.
        2.  The instructions are customizable by the teacher/institution.
    *   **Prerequisites:** Story 2.4

---



## Epic 3: Teacher Content Management

**Expanded Goal:** This epic aims to empower teachers with the ability to easily manage and update the course materials that feed the chatbot. It will provide a secure and intuitive interface for uploading documents, ensuring the chatbot always has access to the most current information, thereby reducing manual intervention and improving data freshness.

**Story Breakdown:**

*   **Story 3.1: Teacher Dashboard & Course Selection**
    *   As a teacher, I want to access a dashboard that lists the courses I teach, so that I can select the course for which I want to manage content.
    *   **Acceptance Criteria:**
        1.  Authenticated teachers are directed to a dashboard displaying their assigned courses.
        2.  Teacher can select a specific course from the list.
        3.  Only courses assigned to the teacher are visible.
    *   **Prerequisites:** Epic 1 (Authentication, Role-Based Access Control)

*   **Story 3.2: Document Upload Interface for Teachers**
    *   As a teacher, I want to upload text documents and presentations for a selected course, so that the chatbot can use this information to answer student questions.
    *   **Acceptance Criteria:**
        1.  Teacher can access a dedicated upload interface for a selected course.
        2.  Interface supports uploading common document formats (e.g., PDF, DOCX, PPTX, TXT).
        3.  System provides visual feedback on upload progress.
        4.  Uploaded files are stored securely.
    *   **Prerequisites:** Story 3.1

*   **Story 3.3: Automated Document Processing & Indexing**
    *   As a system, I want to automatically process newly uploaded teacher documents and integrate them into the chatbot's knowledge base, so that the information is immediately available to students.
    *   **Acceptance Criteria:**
        1.  Upon successful upload, documents are automatically parsed and content extracted.
        2.  Extracted content is converted into embeddings and added to the Pinecone vector database.
        3.  The chatbot's knowledge base is updated to reflect the new information.
        4.  System handles potential errors during processing and notifies the teacher if necessary.
    *   **Prerequisites:** Story 3.2, Epic 2 (Data Ingestion and Indexing)

*   **Story 3.4: Document Management & Versioning (Basic)**
    *   As a teacher, I want to view a list of documents I have uploaded for a course and manage them, so that I can ensure the chatbot uses the correct and most up-to-date materials.
    *   **Acceptance Criteria:**
        1.  Teacher can see a list of all documents uploaded for a specific course.
        2.  Teacher can delete existing documents.
        3.  Uploading a new version of an existing document replaces the old version in the knowledge base.
    *   **Prerequisites:** Story 3.3

**Story Format:**

```
**Story [EPIC.N]: [Story Title]**

As a [user type],
I want [goal/desire],
So that [benefit/value].

**Acceptance Criteria:**
1. [Specific testable criterion]
2. [Another specific criterion]
3. [etc.]

**Prerequisites:** [Dependencies on previous stories, if any]
```

**Story Requirements:**

- **Vertical slices** - Complete, testable functionality delivery
- **Sequential ordering** - Logical progression within epic
- **No forward dependencies** - Only depend on previous work
- **AI-agent sized** - Completable in 2-4 hour focused session
- **Value-focused** - Integrate technical enablers into value-delivering stories

---

**For implementation:** Use the `create-story` workflow to generate individual story implementation plans from this epic breakdown.