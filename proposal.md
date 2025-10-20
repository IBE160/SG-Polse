## Case Title
Course-FAQ Chatbot

## Background
It can be difficult to find information needed for assignments and requirements, deadlines for assignements.
To simplify the process and allow students to find information more effectively, to quickly look up information.

## Purpose
Less questions that teachers need to answer and students don't need to wait for an answer if the answer is already in the course info.

## Target Users
Students and teachers who need to figure out contents of courses


## Core Functionality

**Must have(MVP)**
- User authentication since users will already have a school account
- Linking to important information within the course (Syllabus, course info and deadlines)
- answer user questions and give concise answers to simple questions
- Make sure that the chatbot is always working with updated information
- Guide users to contact teachers with their preffered ways of communication
- All communication must be encrypted and no personal info is to be stored
- Connect to canvas to pull information from

### Nice to Have (Optional Extensions)
- suggestions for how to answer tasks, link to articles, tools necessary, etc
- Suggest what students should focus on based on deadline and perceived assignment difficulty
- Answer on language asked with
- Remember past conversations for users to go back to or to give context to different questions

## Data Requirements
- Users: username, email, password
- Course: Syllabus, course info, deadlines
- Metadata: User questions


## User Stories (Optional)
1. As a student, I want deadline info for current assignments, so that i know how long i have.
2. As a teacher, I want to know what the students have access to, so i don't need to spend a lot of time checking

## Technical Constraints
- must use encrypted data transfer and comply with privacy laws like GDPR
- Must have support user authentication
- Users should only be able to access courses they are enrolled in
- Must be online to access newest information for the course
- Must always answer with sources 


## Success Criteria
- User questions are correctly answered with sources
- Connections are encrypted and only accesable by users
- Chatbot uptime should exceed 90% during the semester
- User questions are answered within a minute
- Course info can not be found by those not taking the course asked about

