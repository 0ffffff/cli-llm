---
phase: 4
plan: 3
wave: 3
depends_on: [1, 2]
files_modified: [src/history/manager.ts, src/config/types.ts]
autonomous: true
user_setup: []

must_haves:
  truths:
    - "Oldest session files are removed when limit is reached"
    - "Limit is configurable in AppConfig"
---

# Plan 4.3: History Cleanup & Config

<objective>
Implement automatic cleanup of old session logs to prevent disk bloat.
Purpose: Requirement REQ-13 (Cache management).
Output: Updated HistoryManager and AppConfig.
</objective>

<context>
Load for context:
- src/history/manager.ts
- src/config/types.ts
</context>

<tasks>

<task type="auto">
  <name>Implement Auto-Cleanup</name>
  <files>src/history/manager.ts</files>
  <action>
    - Add `cleanup(limit: number): Promise<void>` to `HistoryManager`.
    - Logic: List files, sort by modification time (or name if timestamp-based), keep the most recent `limit` files, delete the rest.
    - Call `cleanup` after everytime a session is saved.
  </action>
  <verify>Set limit to 2, create 3 sessions, verify only 2 remains</verify>
  <done>History size is constrained</done>
</task>

</tasks>

<verification>
After all tasks, verify:
- [ ] Directory doesn't exceed history limit.
</verification>

<success_criteria>
- [ ] All tasks verified
- [ ] Must-haves confirmed
</success_criteria>
