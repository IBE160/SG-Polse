# ibe160 Product Requirements Document (PRD)

**Author:** BIP
**Date:** 2025-11-06
**Project Level:** 3
**Target Scale:** Personal/individual

---

## Goals and Background Context

### Goals

### Goals

*   Reduce repetitive inquiries to teachers.
*   Enhance student access to critical course information.
*   Improve efficiency in updating and distributing course details.

### Background Context

### Background Context

The current system makes it difficult for students to find essential course information, leading to frustration and increased workload for teachers who repeatedly answer the same questions. The Course-FAQ Chatbot aims to solve this by providing a quick, accurate, and secure way for students to retrieve information, thereby reducing teacher burden and improving the student experience. This solution will ensure information is always current and guide users to appropriate teacher communication when needed.

---

## Requirements

### Functional Requirements

**User & Authentication**
*   FR001: Users must be able to authenticate using their school-provided email accounts via OAuth 2.0.
*   FR002: The system must verify that a user is enrolled in a specific course before granting access to its information.
*   FR003: The system must prevent access to course information for users who are not enrolled in that course.

**Information Retrieval & Chatbot Core**
*   FR004: The chatbot must be able to answer user questions about course assignments, requirements, and deadlines.
*   FR005: All chatbot answers must cite the source document or location from which the information was retrieved.
*   FR006: The chatbot must provide concise and direct answers to user queries.
*   FR007: The chatbot must be able to interpret and respond to queries that mix English terms within another language (bilingual capability).
*   FR008: The chatbot's context should be limited to the current user session. It should not retain conversation history across sessions.

**Data & Content Management**
*   FR009: The system must connect to the Canvas LMS to pull course information, including syllabus, course info, and deadlines for IBE160.
*   FR010: The system must have a mechanism to ensure the chatbot is always working with the most up-to-date information from Canvas.
*   FR011: Teachers must be able to upload text documents and presentations for the chatbot to process.

**User Guidance & Communication**
*   FR012: The chatbot must guide users on how to contact their teachers through the school's preferred communication channels when it cannot answer a question.

**Security & Privacy**
*   FR013: All communication between the user's browser and the system must be encrypted.
*   FR014: The system must not store any personal user information.

### Non-Functional Requirements

**Performance**
*   NFR001: The chatbot must maintain an uptime exceeding 90% during the semester.
*   NFR002: The average response time for user questions must be within one minute.

**Security & Privacy**
*   NFR003: All data transfer must be encrypted (e.g., HTTPS).
*   NFR004: The system must comply with relevant data privacy laws (e.g., GDPR), including cookie policy and consent mechanisms.
*   NFR005: The system must ensure that only authorized users (enrolled students) can access specific course information.

**Usability**
*   NFR006: The chatbot should provide a user satisfaction rating of 90% or higher for helpful answers.

---

## User Journeys

**User Journey 1: Student Seeks Course Information**

**Persona:** Student (Primary User Segment)
**Goal:** Quickly find information related to course content, assignments, requirements, or deadlines.

**Flow:**
1.  **Access Chatbot:** Student navigates to the chatbot landing page.
    *   *Decision Point:* Is the student authenticated? (FR001)
        *   **No:** Proceed to Authentication.
        *   **Yes:** Skip to Course Selection.
2.  **Authentication (if not logged in):** (FR001, FR013)
    *   Student is redirected to the authentication page.
    *   Student enters school email and password.
    *   *Decision Point:* Is authentication successful?
        *   **No:** Display error message, prompt to retry or contact support.
        *   **Yes:**
            *   *Edge Case:* First-time user?
                *   **Yes:** Receives verification email, clicks link, redirected to chosen course.
                *   **No:** Directly redirected to chosen course.
3.  **Course Selection:** (FR002, FR003)
    *   Student sees a list of available courses they are enrolled in.
    *   Student selects the relevant course (e.g., IBE160).
    *   *Edge Case:* Student attempts to select a course they are not enrolled in.
        *   **Action:** System prevents access, displays message "You are not enrolled in this course."
4.  **Chatbot Interaction:** (FR004, FR005, FR006, FR007, FR008, FR009, FR010, FR012)
    *   Chatbot greets the student and prompts for questions.
    *   Student asks a question (e.g., "What is the deadline for Assignment 3?").
    *   *Decision Point:* Can the chatbot answer the question from available course materials?
        *   **Yes:**
            *   Chatbot provides a concise answer.
            *   Chatbot cites the source of the information (e.g., "Source: IBE160 Syllabus, Page 5").
            *   *Decision Point:* Is the answer helpful?
                *   **Yes:** (Implicit feedback)
                *   **No:** Student may rephrase, ask a follow-up, or indicate dissatisfaction.
        *   **No:**
            *   Chatbot indicates it cannot answer the question.
            *   Chatbot guides the student on how to contact the teacher via preferred communication methods.
5.  **Session End:** Student closes the chatbot or navigates away. Chatbot session context is cleared. (FR008)

**User Journey 2: Teacher Updates Course Information**

**Persona:** Teacher (Secondary User Segment)
**Goal:** Upload new or updated course materials for the chatbot to process.

**Flow:**
1.  **Access Chatbot Admin/Upload Interface:** Teacher navigates to the chatbot's administrative or upload page.
    *   *Decision Point:* Is the teacher authenticated? (FR001)
        *   **No:** Proceed to Authentication.
        *   **Yes:** Skip to Course Selection.
2.  **Authentication (if not logged in):** (FR001, FR013)
    *   Teacher is redirected to the authentication page.
    *   Teacher enters school email and password.
    *   *Decision Point:* Is authentication successful?
        *   **No:** Display error message, prompt to retry or contact support.
        *   **Yes:**
            *   *Edge Case:* First-time user?
                *   **Yes:** Receives verification email, clicks link, redirected to chosen course.
                *   **No:** Directly redirected to chosen course.
3.  **Course Selection:** (FR002, FR003)
    *   Teacher sees a list of courses they teach.
    *   Teacher selects the relevant course.
4.  **Upload Materials:** (FR011, FR013)
    *   Teacher is presented with an interface to upload text documents and presentations.
    *   Teacher selects files from their local system.
    *   Teacher initiates the upload.
    *   *Decision Point:* Is the upload successful?
        *   **No:** Display error message (e.g., file format not supported, network error).
        *   **Yes:**
            *   System processes the uploaded documents. (FR010)
            *   Chatbot verifies it has received and integrated the new information. (FR010)
            *   System confirms to the teacher that the information has been updated and is available to the chatbot.
5.  **Session End:** Teacher closes the interface or navigates away.

---

## UX Design Principles

1.  **Clarity & Conciseness:** Answers should be easy to understand and to the point, avoiding jargon.
2.  **Efficiency:** Users should be able to find information quickly with minimal effort.
3.  **Trustworthiness:** Information provided must be accurate and sourced, fostering user confidence.
4.  **Accessibility:** The interface should be usable by all students, including those with disabilities.

---

## User Interface Design Goals

1.  **Platform:** Web-based application.
2.  **Core Screens/Views:**
    *   Landing Page (Course Selection)
    *   Authentication Page
    *   Chatbot Interface (main interaction screen)
    *   Teacher Upload Interface
3.  **Interaction Patterns:**
    *   Conversational interface for students.
    *   Form-based uploads for teachers.
    *   Clear navigation for course selection.
4.  **Design Constraints:**
    *   Utilize React 18 and Tailwind CSS for frontend development.
    *   Adhere to a clean, modern, and intuitive design aesthetic.

---

## Epic List

*   **Epic 1: Project Foundation & User Authentication**
    *   **Goal:** Establish the project's technical foundation and implement a secure user authentication system.
    *   **Estimated Story Count:** 5-8 stories

*   **Epic 2: Core Chatbot Functionality & Information Retrieval**
    *   **Goal:** Implement the core chatbot interface and enable it to answer student questions based on course materials.
    *   **Estimated Story Count:** 6-10 stories

*   **Epic 3: Teacher Content Management**
    *   **Goal:** Provide teachers with the ability to upload and manage course materials for the chatbot.
    *   **Estimated Story Count:** 4-6 stories

> **Note:** Detailed epic breakdown with full story specifications is available in [epics.md](./epics.md)

---

## Out of Scope

**Out of Scope**

The following features and capabilities are explicitly out of scope for the current MVP:

*   **Advanced AI Functionality:**
    *   Suggestions for how to answer tasks, link to articles, or necessary tools.
    *   Suggestions for students on what to focus on based on deadlines and perceived assignment difficulty.
    *   Remembering past conversations for users to go back to or to give context to different questions (beyond single session context).
*   **Expanded Course Support:** Integration with other courses beyond IBE160 in the initial phase.
*   **Multi-Platform Native Applications:** The MVP will be web-based; native mobile or desktop applications are not included.
*   **Complex Personalization:** Features requiring deep personalization beyond user authentication and course enrollment.
