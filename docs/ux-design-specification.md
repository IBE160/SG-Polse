# UX Design Specification - ibe160 Course-FAQ Chatbot

**Author:** BIP (facilitated by Sally, UX Designer Agent)
**Date:** 2025-11-13
**Project Level:** 3
**Target Scale:** Personal/individual
**Communication Language:** English
**Document Output Language:** English

---

## 1. Project Vision & Goals

The ibe160 Course-FAQ Chatbot aims to:
*   Reduce repetitive inquiries to teachers.
*   Enhance student access to critical course information (assignments, requirements, deadlines for IBE160).
*   Improve efficiency in updating and distributing course details.
*   Provide a quick, accurate, and secure way for students to retrieve information, thereby reducing teacher burden and improving the student experience.

## 2. Target Users & Personas

*   **Primary User Segment:** Students who need to quickly find information related to course content, assignments, requirements, and deadlines.
*   **Secondary User Segment:** Teachers who need to provide course information efficiently and reduce the volume of direct inquiries about readily available course details.

## 3. Core Experience & Platform

*   **Core Experience:** The primary experience is efficient, accurate, and accessible information retrieval through a conversational interface.
*   **Platform:** Web-based application.

## 4. Desired Emotional Response

Users should feel:
*   Empowered and in control.
*   Efficient and productive.
*   Calm and focused.

## 5. Inspiration Analysis

(Based on user input, if provided, otherwise general principles)
The design draws inspiration from modern, intuitive chat interfaces that prioritize clarity and direct interaction, while also providing structured information where necessary.

## 6. Visual Foundation

### Color Theme: Modern & Approachable (Theme 2)

*   **Personality:** Intuitive, user-friendly, contemporary.
*   **Visual Style:** Vibrant accents, clean, inviting.
*   **Primary Color:** `#6c5ce7` (Purple) - for key actions and branding.
*   **Secondary Color:** `#00cec9` (Teal) - for supporting elements and accents.
*   **Success Color:** `#20c997`
*   **Error Color:** `#fd7e14`
*   **Neutral Palette:** Ranging from `#fdfdfd` (lightest) to `#495057` (darkest) for backgrounds, borders, and secondary text.
*   **Text Color:** `#343a40`

### Typography System

Leveraging Tailwind CSS defaults for consistency and efficiency:
*   **Font Families:** `Inter` (or similar modern sans-serif) for both headings and body text; standard monospace for code.
*   **Type Scale:** Tailwind's flexible type scale (e.g., `text-sm`, `text-base`, `text-lg`, etc.) for clear hierarchy.
*   **Font Weights:** Standard weights (`normal`, `medium`, `semibold`, `bold`) for emphasis.
*   **Line Heights:** Tailwind's default line heights for optimal readability.

### Spacing and Layout Foundation

Leveraging Tailwind CSS defaults:
*   **Base Unit:** 4px (Tailwind's spacing scale is built on a 4px base).
*   **Spacing Scale:** Tailwind's comprehensive spacing scale (e.g., `p-4`, `m-8`).
*   **Layout Grid:** Flexible 12-column grid system.
*   **Container Widths:** Tailwind's responsive breakpoints (`sm`, `md`, `lg`, `xl`, `2xl`) and container classes.

## 7. Design Direction: Card-Based Conversational Flow (Direction 3)

*   **Personality:** Engaging & Actionable.
*   **Best for:** Rich feedback, suggested actions.
*   **Key Characteristics:** Single column, distinct answer cards, interactive.

### Design Decisions:
*   **Layout:** Single column, answers presented as distinct cards.
*   **Density:** Balanced.
*   **Navigation:** Implicit (within chat interface).
*   **Primary action prominence:** High (send button).
*   **Visual Style:** Cards provide subtle elevation/depth.

## 8. User Journey Flows

### User Journey 1: Student Seeks Course Information

*   **User Goal:** Quickly find information related to course content, assignments, requirements, or deadlines.
*   **Approach:** Single-Screen Chat Interface.

**Flow Steps:**
1.  **Access Chatbot / Authentication:** Student navigates to landing page, authenticates via OAuth 2.0.
2.  **Course Selection:** Student selects IBE160 from their enrolled courses.
3.  **Chatbot Interaction:**
    *   User sees chat interface with prompt, input field, send button.
    *   User types question, clicks send.
    *   System shows loading indicator (3 bouncing dots).
    *   System provides concise, card-based answer with source, or guides to teacher contact if unable to answer.
4.  **Session End:** User closes chat; session context cleared.

```mermaid
graph TD
    A[Student Accesses Chatbot] --> B{Authenticated?};
    B -- No --> C[Authentication Page];
    C --> D{Auth Successful?};
    D -- No --> C;
    D -- Yes --> E[Course Selection];
    B -- Yes --> E;
    E --> F{Course Selected?};
    F -- No (Not Enrolled) --> E;
    F -- Yes --> G[Chatbot Interface (Single Screen)];
    G --> H[Student Asks Question];
    H --> I[Chatbot Processes Query];
    I --> J{Answer Found?};
    J -- Yes --> K[Chatbot Provides Card-Based Answer with Source];
    J -- No --> L[Chatbot Guides to Teacher Contact];
    K --> M[Student Continues/Ends Session];
    L --> M;
    M --> N[Session Ends];
```

### User Journey 2: Teacher Updates Course Information

*   **User Goal:** Upload new or updated course materials for the chatbot to process.
*   **Approach:** Template-first File Management Interface.

**Flow Steps:**
1.  **Access Admin/Upload Interface / Authentication:** Teacher navigates to admin page, authenticates via OAuth 2.0.
2.  **Course Selection:** Teacher selects their course (IBE160).
3.  **Upload Materials:**
    *   Teacher sees file management interface with predefined categories (e.g., Syllabus, Assignments).
    *   Teacher uploads, replaces, or removes files within categories.
    *   System shows progress indicator, provides quick confirmation (toast) or error message.
4.  **Session End:** Teacher closes interface; changes are persistent.

```mermaid
graph TD
    A[Teacher Accesses Admin/Upload Interface] --> B{Authenticated?};
    B -- No --> C[Authentication Page];
    C --> D{Auth Successful?};
    D -- No --> C;
    D -- Yes --> E[Teacher Dashboard / Course Selection];
    B -- Yes --> E;
    E --> F[Select Course];
    F --> G[File Management Interface (Template-first)];
    G --> H{Teacher Action: Upload/Replace/Remove File};
    H -- Upload/Replace --> I[Select File from Local System];
    H -- Remove --> J[Confirm Removal];
    I --> K[System Processes File];
    J --> K;
    K --> L{Action Successful?};
    L -- Yes --> M[Quick Confirmation & Update File List];
    L -- No --> N[Display Error Message];
    M --> O[Teacher Continues/Ends Session];
    N --> O;
    O --> P[Session Ends];
```

## 9. Component Library Strategy & Custom Component Design

### Common UI Components (Tailwind CSS based):
*   **Buttons:** Primary, Secondary, Send, Upload, Remove, Confirm, Cancel.
*   **Input Fields:** Text input for chat, file input for uploads, search input.
*   **Cards:** For chatbot responses, file display.
*   **Modals/Dialogs:** For authentication, confirmation, error messages.
*   **Navigation:** Course selection list, simple header/footer.
*   **Loading Indicators:** Spinners, progress bars.
*   **Notifications/Toast Messages:** For feedback.
*   **Authentication UI:** Login form, OAuth buttons.
*   **List/Table:** For displaying courses, uploaded files.

### Custom Components:

#### Chat Bubble/Card Component
*   **Purpose:** Display text and links from user/chatbot in conversational format.
*   **Anatomy:** Text content, links, source citation.
*   **States:** Default (static), Loading (3 bouncing dots).
*   **Variants:** User Bubble (styled for user), Bot Bubble (different color), Size (dynamic to text content).
*   **Behavior:** Text selection/copy.
*   **Accessibility:** ARIA roles (`article`/`log`, `status`), keyboard navigable, screen reader announcements.

#### File Upload/Management Component (Teacher)
*   **Purpose:** Give teachers control over chatbot's knowledge base by managing course files.
*   **Anatomy:** Category sections, file list, file item (full name, usage description), action buttons (Upload, Replace, Remove).
*   **States:** Default (file list), Hover (file item expands to show full usage), Loading, Error.
*   **Variants:** Clear display of full file name and usage.
*   **Behavior:** Add file (opens selector), Remove file (prompts confirmation), Hover (reveals usage details).
*   **Accessibility:** ARIA roles (`list`, `listitem`), keyboard navigation, screen reader announcements.

#### Course Selector Component
*   **Purpose:** Allow users to select a course (IBE160 for this project).
*   **Anatomy:** Course name display.
*   **States:** Default, Hover (gets slightly larger).
*   **Variants:** Different colors for different courses (though one for IBE160).
*   **Behavior:** Click (opens related chatbot interface).
*   **Accessibility:** ARIA role (`button`/`link`), keyboard focusable/activatable, screen reader announcements.

## 10. UX Pattern Decisions for Consistency

### Feedback Patterns
*   **Success:** Indicated by the bot's response itself.
*   **Error:** Red-colored error message.
*   **Warning:** Yellow-colored message explaining the issue.
*   **Info:** Displayed in a separate, distinct bubble.
*   **Loading:** A bubble with three bouncing dots.

### Button Hierarchy
*   **Primary Action (Send, Upload):** Solid fill with Primary Color (`#6c5ce7`).
*   **Secondary Action (e.g., "Stop Chatting", "Cancel"):** Outline button with Primary Color border/text, or solid fill with neutral color.
*   **Tertiary Action (e.g., "View Source"):** Text-only button.
*   **Destructive Action (e.g., "Remove File"):** Solid fill with Error Color (`#fd7e14`), always requires explicit confirmation via modal.

### Form Patterns
*   **Label position:** Placeholder text for inline label.
*   **Required field indicator:** Asterisk `*` next to placeholder/label; input field has distinct outline when needing attention.
*   **Validation timing:** On change for immediate feedback.
*   **Error display:** Small, red text message displayed directly above the input field.
*   **Help text:** Subtle, smaller text displayed directly above the input field.

### Confirmation Patterns
*   **Delete / Irreversible actions:** Use a modal dialog for confirmation, clearly stating action and consequences, with "Delete" and "Cancel" buttons.
*   **Leave unsaved (Student Chat):** No confirmation needed; chat is single-session.
*   **Leave unsaved (Teacher File Management):** Browser-native prompt ("Are you sure you want to leave?") if unsaved changes exist.

### Navigation Patterns
*   **Active state indication:** Active/selected item in a list will have a distinct background color (e.g., light purple/gray) and potentially bolder text.
*   **Breadcrumb usage:** Not used due to flat navigation hierarchy.
*   **Back button behavior:** Browser's back button will work as expected.
*   **Deep linking:** Application will use a clear URL structure (e.g., `/course/{courseId}/chat`, `/course/{courseId}/files`) to enable deep linking.

### Empty State Patterns
*   **Purpose:** To guide users, prevent confusion, and provide a clear path forward when there is no data to display. Empty states should be helpful, not just blank.

*   **Student Chat - First Use (Initial State):**
    *   **Visual:** The chat window will display a welcome card.
    *   **Content:**
        *   **Heading:** "Welcome to the IBE160 Assistant!"
        *   **Body:** "I'm here to help you with questions about course content, assignments, and deadlines. What can I help you find today?"
        *   **Suggested Actions:** Display 2-3 buttons for common queries (e.g., "Next assignment deadline?", "Where is the syllabus?").

*   **Student Chat - No Answer Found:**
    *   **Visual:** The chatbot responds with a specific card indicating no answer was found.
    *   **Content:**
        *   **Heading:** "I couldn't find a specific answer for that."
        *   **Body:** "My knowledge is based on the documents provided by your teacher. You could try rephrasing your question, or if you need more help, it's best to contact your teacher directly."
        *   **Action:** Provide a clear link or information on how to contact the teacher.

*   **Teacher View - No Files Uploaded:**
    *   **Visual:** The file management area will display a prominent instruction block instead of an empty list.
    *   **Content:**
        *   **Heading:** "Let's build your chatbot's knowledge."
        *   **Body:** "This is where you'll manage the files your chatbot uses to answer student questions. Get started by uploading your first document, like the course syllabus or an assignment description."
        *   **Action:** A primary "Upload Document" button is displayed centrally in this block.

## 11. Responsive and Accessibility Strategy

### Responsive Design
*   **Target Devices:** Desktop (primary focus), with a baseline usable experience for Tablet and Mobile.
*   **Breakpoint Strategy:**
    *   **Mobile:** `< 768px` (Tailwind's `md` breakpoint)
    *   **Tablet:** `768px` to `1024px` (Tailwind's `md` to `lg` breakpoints)
    *   **Desktop:** `min-width: 1024px` (Tailwind's `lg` breakpoint)
    *   **Large Desktop:** `min-width: 1280px` (Tailwind's `xl` breakpoint) and above.

*   **Adaptation Patterns:**
    *   **Navigation Adaptation:** On Mobile and Tablet, any horizontal navigation bars (e.g., in the teacher's admin interface) will collapse into a single "hamburger" menu icon that reveals navigation links when tapped.
    *   **Content Organization:** All multi-column layouts will stack vertically into a single column on Mobile and Tablet screens. The student chat interface, being single-column, will naturally adapt, with its `max-width` ensuring readability.
    *   **Touch Targets:** All interactive elements (buttons, links, input fields) must have a minimum touch target size of 44x44 pixels on all devices to ensure usability on touchscreens.

### Accessibility Strategy
*   **Compliance Target:** WCAG 2.1 Level AA.
*   **Key Requirements:** Sufficient color contrast, full keyboard navigation, visible focus indicators, meaningful ARIA labels, descriptive alt text, proper form labels, clear error messages.
*   **Testing Strategy:** Automated tools (Lighthouse, axe DevTools), manual keyboard-only testing, screen reader testing.