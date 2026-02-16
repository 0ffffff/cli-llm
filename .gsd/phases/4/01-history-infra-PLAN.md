---
phase: 4
plan: 1
wave: 1
depends_on: []
files_modified: [src/history/manager.ts, src/api/types.ts]
autonomous: true
user_setup: []

must_haves:
  truths:
    - "History directory is created in ~/.cli-llm/history"
    - "Can read/write ChatMessage arrays to disk"
  artifacts:
    - "src/history/manager.ts exists"
---

# Plan 4.1: History Infrastructure

<objective>
Implement the base infrastructure for storing and retrieving conversation logs.
Purpose: Provide persistent storage for interactive sessions.
Output: src/history/manager.ts
</objective>

<context>
Load for context:
- .gsd/phases/4/RESEARCH.md
- src/config/manager.ts (for dir pattern)
- src/api/types.ts
</context>

<tasks>

<task type="auto">
  <name>Implement HistoryManager</name>
  <files>src/history/manager.ts</files>
  <action>
    Create a `HistoryManager` class that:
    - Defines `HISTORY_DIR = ~/.cli-llm/history`.
    - `saveSession(sessionId: string, messages: ChatMessage[]): Promise<void>`: Saves messages to a JSON file.
    - `loadSession(sessionId: string): Promise<ChatMessage[]>`: Reads messages from a JSON file.
    - `listSessions(): Promise<string[]>`: Lists available session IDs (file names).
    - Ensures directory existence on first use.
    - Sets 600 permissions on files.
  </action>
  <verify>Run a test script to save and then load a session</verify>
  <done>HistoryManager correctly persists and retrieves data</done>
</task>

</tasks>

<verification>
After all tasks, verify:
- [ ] `~/.cli-llm/history` exists.
- [ ] File content matches expected JSON array.
</verification>

<success_criteria>
- [ ] All tasks verified
- [ ] Must-haves confirmed
</success_criteria>
