# Engineering Backlog

This backlog collects cross-cutting or future action items that emerge from reviews and planning.

Routing guidance:

- Use this file for non-urgent optimizations, refactors, or follow-ups that span multiple stories/epics.
- Must-fix items to ship a story belong in that story’s `Tasks / Subtasks`.
- Same-epic improvements may also be captured under the epic Tech Spec `Post-Review Follow-ups` section.

| Date | Story | Epic | Type | Severity | Owner | Status | Notes |
| ---- | ----- | ---- | ---- | -------- | ----- | ------ | ----- |
| 2025-12-01 | 1.3 | 1 | Bug | High | TBD | Open | Persistent SyntaxError during Jest test execution for both backend and frontend tests. Blocks automated verification. |
| 2025-12-01 | 1.3 | 1 | TechDebt | Low | TBD | Open | Redundant (await import('crypto')).createHash call. [file: ibe160/src/server/api/routers/auth.ts:77] |
| 2025-12-01 | 2.2 | 2 | Bug | High | TBD | Open | Implement all missing files as listed in the "Dev Agent Record -> File List" of Story 2.2. |
| 2025-12-01 | 2.2 | 2 | Bug | High | TBD | Open | Ensure all Acceptance Criteria (AC1-AC4) are fully implemented and verifiable for Story 2.2. |
| 2025-12-01 | 2.2 | 2 | Bug | High | TBD | Open | Complete all tasks listed under "Tasks / Subtasks" in Story 2.2. |
| 2025-12-01 | 2.2 | 2 | TechDebt | Medium | TBD | Open | Address Jest configuration and module mocking issues to enable proper unit testing for server-side modules for Story 2.2. |