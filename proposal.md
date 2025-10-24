## Case Title
Course-FAQ Chatbot

## Background
It can be difficult to find information needed for assignments and requirements, deadlines for assignements.
To simplify the process and allow students to find information more effectively, to quickly look up information.

## Purpose
Less questions that teachers need to answer and students don't need to wait for an answer if the answer is already in the course info.

## Target Users
Students and teachers who need to figure out contents of courses

##User flow

Flow 1 Student uses chatbot
1. Landing page
 * User sees available courses 
 * User selects course
2. Authentication
 * User sent to authentication if not logged in
 * User registers with school email and password
 * Receives verification email and clicks verification link
 * Redirected to chosen course after registering
3. Chatbot for course
 * User is greeted by chatbot and prompted to ask questions
 * User asks questions and receives answers


Flow 2 Teacher updates chatbot
1. Landing page
 * User sees available courses 
 * User selects course
2. Authentication
 * User sent to authentication if not logged in
 * User registers with school email and password
 * Receives verification email and clicks verification link
 * Redirected to chosen course after registering
3. Chatbot
 * User uploads text documents and presentations with information
 * Chatbot verifies it has received the information 


## Core Functionality

**Must have(MVP)**
- User authentication since users will already have a school account
- Linking to important information within the course in this case IBE160 (Syllabus, course info and deadlines)
- answer user questions and give concise answers to simple questions
- Make sure that the chatbot is always working with updated information
- Guide users to contact teachers with their preffered ways of communication
- All communication must be encrypted and no personal info is to be stored
- Connect to canvas to pull information from
- Ai has to bilingual and has to be able to interpret materials which often have english terms.
- Ai has to have single session context availbility

### Technology to use
- The project is web based
- Hosting: local
- Frontend technology: React 18 and Tailwind
- Backend technology: Node.js
- database: supabase
- Authentication: Oauth 2.0
- Api design: Rest API

### Nice to Have (Optional Extensions)
- suggestions for how to answer tasks, link to articles, tools necessary, etc
- Suggest what students should focus on based on deadline and perceived assignment difficulty
- Answer on language asked with
- Remember past conversations for users to go back to or to give context to different questions

## Data Requirements
- Users: username, email, password
- Course: Syllabus, course info, deadlines
- What personal data will be stored and why: UserID and ChatID´s for each UserID
- How long conversation history is retained: 1 year, longer than a semester for recalling specific stuff.
- User rights (data export, deletion requests): Users can export a chat log for personal storage, later access etc.. Simple trashcan icon next to chats, easy deletion, full wipe
- Data processing agreements if using third-party AI APIs
- Cookie policy and consent mechanisms: cookie compliance from gdpr.eu https://gdpr.eu/cookies/
- Testing with real course documents?: yes





## User Stories
1. As a student, I want deadline info for current assignments, so that i know how long i have.
2. As a teacher, I want to know what the students have access to, so i don't need to spend a lot of time checking

## Technical Constraints
- must use encrypted data transfer and comply with privacy laws like GDPR
- Must have support user authentication
- Users should only be able to access courses they are enrolled in
- Must be online to access newest information for the course
- Must always answer with sources 
- How will you measure answer quality?: user feedback
- Plan for handling incorrect answers?: place warnings about potential inaccuracy, and that answers should be double checked
- implementing user feedback mechanisms (thumbs up/down)?: yes
- Accuracy target for success criteria (e.g., "90% of answers rated helpful by users"): good metric


## Success Criteria
- User questions are correctly answered with sources
- Connections are encrypted and only accesable by users
- Chatbot uptime should exceed 90% during the semester
- User questions are answered within a minute
- Course info can not be found by those not taking the course asked about

