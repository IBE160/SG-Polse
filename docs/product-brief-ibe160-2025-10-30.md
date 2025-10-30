# Product Brief: Course-FAQ Chatbot

**Date:** 2025-10-30
**Author:** BIP
**Status:** Draft for PM Review

---

## Executive Summary

The Course-FAQ Chatbot aims to simplify information retrieval for students and teachers regarding course assignments, requirements, and deadlines. By providing quick, accurate answers, the chatbot will reduce the burden on teachers and improve student access to critical information. The MVP will focus on user authentication, linking to course information (e.g., syllabus, deadlines), answering simple questions, ensuring updated information, guiding users to teacher communication, and maintaining data privacy. The project will be web-based, utilizing React 18, Tailwind, Node.js, Supabase, OAuth 2.0, REST API, and Pinecone.

---

## Problem Statement

It is currently difficult for students to find necessary information for assignments, requirements, and deadlines. This leads to students struggling to access critical course details and teachers spending excessive time answering repetitive questions.

---

## Proposed Solution

To address these issues, we propose developing a Course-FAQ Chatbot. This chatbot will enable students to quickly look up information, reducing their waiting time for answers and decreasing the number of repetitive questions teachers need to address. The solution will provide concise answers, guide users to appropriate teacher communication channels, and ensure all information is up-to-date and secure.

---

## Target Users

### Primary User Segment

Students who need to quickly find information related to course content, assignments, requirements, and deadlines.

### Secondary User Segment

Teachers who need to provide course information efficiently and reduce the volume of direct inquiries about readily available course details.

---

## Goals and Success Metrics

### Business Objectives

*   Reduce the number of repetitive questions teachers receive.
*   Improve student access to course-related information.
*   Streamline the process of updating and disseminating course information.

### User Success Metrics

*   High user satisfaction with the chatbot's ability to answer questions.
*   Reduced time spent by students searching for course information.
*   Increased efficiency for teachers in managing student inquiries.

### Key Performance Indicators (KPIs)

*   User feedback ratings (e.g., 90% of answers rated helpful).
*   Chatbot uptime exceeding 90% during the semester.
*   Average response time for user questions within one minute.
*   Number of teacher inquiries related to course information.

---

## Strategic Alignment and Financial Impact

### Financial Impact

(Not explicitly detailed in proposal.md, but can infer cost savings from reduced teacher workload and improved student retention/satisfaction.)

### Company Objectives Alignment

(Not explicitly detailed in proposal.md, but aligns with improving educational efficiency and student support.)

### Strategic Initiatives

(Not explicitly detailed in proposal.md)

---

## MVP Scope

### Core Features (Must Have)

*   User authentication using school accounts (OAuth 2.0).
*   Linking to important course information (Syllabus, course info, deadlines) for IBE160.
*   Ability to answer user questions concisely.
*   Mechanism to ensure the chatbot always works with updated information (e.g., connecting to Canvas).
*   Guidance for users to contact teachers via preferred communication methods.
*   Encrypted communication and no storage of personal info.
*   Connection to Canvas to pull information.
*   Bilingual AI capable of interpreting materials with English terms.
*   AI with single session context availability.

### Out of Scope for MVP

*   Suggestions for how to answer tasks, link to articles, tools necessary.
*   Suggestions for students on what to focus on based on deadlines and perceived assignment difficulty.
*   Answering in the language asked with (beyond bilingual interpretation).
*   Remembering past conversations for users to go back to or to give context to different questions (beyond single session context).

### MVP Success Criteria

*   User questions are correctly answered with sources.
*   Connections are encrypted and only accessible by authorized users.
*   Chatbot uptime should exceed 90% during the semester.
*   User questions are answered within a minute.
*   Course info cannot be found by those not taking the course.

---

## Post-MVP Vision

### Phase 2 Features

*   Suggestions for how to answer tasks, link to articles, tools necessary.
*   Suggest what students should focus on based on deadline and perceived assignment difficulty.
*   Answer on language asked with.
*   Remember past conversations for users to go back to or to give context to different questions.

### Long-term Vision

(Not explicitly detailed in proposal.md, but could involve integration with more systems, advanced personalization, etc.)

### Expansion Opportunities

(Not explicitly detailed in proposal.md, but could involve expanding to other courses, institutions, or educational platforms.)

---

## Technical Considerations

### Platform Requirements

The project is web-based.

### Technology Preferences

*   **Hosting**: Local (for development/initial deployment).
*   **Frontend**: React 18 and Tailwind.
*   **Backend**: Node.js.
*   **Database**: Supabase.
*   **Authentication**: OAuth 2.0.
*   **API Design**: REST API.
*   **Vector Database**: Pinecone.

### Architecture Considerations

(Not explicitly detailed in proposal.md, but implies a client-server architecture with a database and AI integration.)

---

## Constraints and Assumptions

### Constraints

*   Must use encrypted data transfer and comply with privacy laws like GDPR.
*   Must support user authentication.
*   Users should only be able to access courses they are enrolled in.
*   Must be online to access the newest information for the course.
*   Must always answer with sources.

### Key Assumptions

*   Users will have school email accounts for authentication.
*   Course information (syllabus, deadlines) will be available in a structured or extractable format (e.g., Canvas).
*   Teachers will be willing to upload text documents and presentations for the chatbot to process.

---

## Risks and Open Questions

### Key Risks

*   **Data Privacy**: Ensuring full compliance with GDPR and other privacy laws, especially with third-party AI APIs.
*   **Accuracy of AI Answers**: Potential for incorrect answers and the need for robust handling mechanisms.
*   **Data Integration**: Challenges in connecting to Canvas and pulling information effectively.
*   **Bilingual Interpretation**: Ensuring accurate interpretation and response for materials with English terms.

### Open Questions

*   How will answer quality be measured (beyond user feedback)?
*   What is the plan for handling incorrect answers (e.g., warnings, double-checking)?
*   What are the data processing agreements if using third-party AI APIs?
*   What are the specific cookie policy and consent mechanisms required (referencing gdpr.eu)?
*   Will testing be conducted with real course documents?

### Areas Needing Further Research

*   Detailed plan for measuring answer quality and handling inaccuracies.
*   Specifics of data processing agreements for third-party AI APIs.
*   Implementation details for GDPR-compliant cookie policy and consent.

---

## Appendices

### A. Research Summary

*   **Library Research**: `docs\research-technical-2025-10-30.md`
*   **Library Brainstorm**: `docs\scamper-brainstorming-chatbot.md`

### B. Stakeholder Input

(Not explicitly detailed in proposal.md)

### C. References

*   GDPR cookie compliance: `https://gdpr.eu/cookies/`

---

_This Product Brief serves as the foundational input for Product Requirements Document (PRD) creation._

_Next Steps: Handoff to Product Manager for PRD development using the `workflow prd` command._