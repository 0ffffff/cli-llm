---
phase: 4
plan: 2
wave: 2
depends_on: [1]
files_modified: [src/cli/session.tsx, index.tsx]
autonomous: true
user_setup: []

must_haves:
  truths:
    - "New interactive sessions generate a unique ID"
    - "Messages are auto-saved to disk after every API response"
    - "History is loaded if a session ID is provided"
  artifacts:
    - "Session component accepts a sessionId prop"
---

# Plan 4.2: Integrated Persistence

<objective>
Connect the Session component to the HistoryManager to ensure chats are never lost.
Purpose: Realize the "resume chats" and "conversation logs" requirements.
Output: Integrated Session component.
</objective>

<context>
Load for context:
- src/history/manager.ts
- src/cli/session.tsx
- index.tsx
</context>

<tasks>

<task type="auto">
  <name>Enable Session State Persistence</name>
  <files>src/cli/session.tsx</files>
  <action>
    - Add `sessionId` to `SessionProps`.
    - In `useEffect` (on mount), load history using `HistoryManager.loadSession(sessionId)`.
    - In `handleSubmit`, after `setStatus('idle')` (when assistant response is complete), call `HistoryManager.saveSession(sessionId, newMessages)`.
  </action>
  <verify>Start a session, type a message, exit, and check the history file exists</verify>
  <done>Session data appears in ~/.cli-llm/history</done>
</task>

<task type="auto">
  <name>ID Generation in Entry Point</name>
  <files>index.tsx</files>
  <action>
    - Generate a new `sessionId` (e.g., `date-random`) in the `llm` (no args) action.
    - Pass this ID to the `Session` component.
  </action>
  <verify>Run `llm` and check if a new file is created in history</verify>
  <done>Every interactive run is logged uniquely</done>
</task>

</tasks>

<verification>
After all tasks, verify:
- [ ] Files are created correctly in `history/`.
- [ ] Content is valid JSON.
</verification>

<success_criteria>
- [ ] All tasks verified
- [ ] Must-haves confirmed
</success_criteria>
