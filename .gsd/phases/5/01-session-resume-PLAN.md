---
phase: 5
plan: 1
wave: 1
depends_on: []
files_modified: [index.tsx, src/cli/session.tsx, src/history/manager.ts]
autonomous: true
user_setup: []

must_haves:
  truths:
    - "Users can resume a specific session by passing an ID"
    - "The CLI can list recent sessions"
  artifacts:
    - "index.tsx supports a 'list' command"
---

# Plan 5.1: Session Resumption & Listing

<objective>
Implement the ability to list and resume previous chat sessions.
Purpose: Complete the conversation management lifecycle.
Output: Resumption support in index.tsx and Session component.
</objective>

<context>
Load for context:
- .gsd/SPEC.md
- src/history/manager.ts
- src/cli/session.tsx
- index.tsx
</context>

<tasks>

<task type="auto">
  <name>Implement Session Listing</name>
  <files>index.tsx</files>
  <action>
    Add a `list` command to the CLI using `commander`.
    It should call `HistoryManager.listSessions()` and print them to the terminal with timestamps if possible (or just IDs for now).
  </action>
  <verify>Run `bun index.tsx list`</verify>
  <done>IDs of previous sessions are displayed</done>
</task>

<task type="auto">
  <name>Implement Session Resume</name>
  <files>index.tsx, src/cli/session.tsx</files>
  <action>
    - Add a `--resume <id>` option to the main command.
    - If provided, use the existing ID instead of generating a new one.
    - The `Session` component already loads history from the ID, so it should "just work" once the ID is passed.
  </action>
  <verify>Run `bun index.tsx list`, pick an ID, and run `bun index.tsx --resume <id>`</verify>
  <done>Previous messages are loaded and new messages are appended to the same file</done>
</task>

</tasks>

<verification>
After all tasks, verify:
- [ ] Session persists across multiple "resume" runs.
</verification>

<success_criteria>
- [ ] All tasks verified
- [ ] Must-haves confirmed
</success_criteria>
