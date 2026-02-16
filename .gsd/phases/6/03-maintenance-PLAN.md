---
phase: 6
plan: 3
wave: 2
---

# Plan 6.3: System Maintenance

<objective>
Implement factory reset functionality for the CLI.
Output: A 'reset' command to clear all local data.
</objective>

<context>
- src/history/manager.ts
- src/config/manager.ts
- index.tsx
</context>

<tasks>

<task type="auto">
  <name>Implement Reset Command</name>
  <files>index.tsx</files>
  <action>
    - Add a `reset` command to `commander`.
    - Implement a confirmation prompt in Ink if possible, or just a `readline` prompt for simplicity if not in a full Ink render yet.
    - If confirmed, delete the `~/.cli-llm` directory content (effectively a fresh install).
  </action>
  <verify>Run `llm reset`, confirm, and verify the config/history directories are gone.</verify>
  <done>Quick path to start clean.</done>
</task>

</tasks>

<success_criteria>
- [ ] `llm reset` removes all local data after confirmation.
</success_criteria>
