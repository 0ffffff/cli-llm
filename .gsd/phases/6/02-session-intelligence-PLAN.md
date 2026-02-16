---
phase: 6
plan: 2
wave: 2
---

# Plan 6.2: Session Intelligence

<objective>
Implement interactive session selection and persistence-friendly naming.
Output: Interactive picker for --resume and auto-generated session names.
</objective>

<context>
- src/history/manager.ts
- src/cli/session.tsx
- index.tsx
</context>

<tasks>

<task type="auto">
  <name>Implement Session Naming</name>
  <files>src/history/manager.ts, src/cli/session.tsx</files>
  <action>
    - Update `HistoryManager` to support metadata (like a session name).
    - In `Session` component, after first user message is sent, generate a 3-5 word name (or just take first 30 chars).
    - Store this name in the `.json` session file (wrap messages in an object with a `name` field).
  </action>
  <verify>Check history JSON; should contain a 'name' field.</verify>
  <done>Sessions are named rather than just timestamped.</done>
</task>

<task type="auto">
  <name>Interactive Session Picker</name>
  <files>index.tsx, src/cli/SessionPicker.tsx</files>
  <action>
    - Create a `SessionPicker` component using `ink-select-input`.
    - Integrated into `index.tsx` when `-s` or `--select` is passed.
    - Component should list recent sessions (using their stored names) and let the user select one or "New Session".
  </action>
  <verify>Run `llm --select`; picker should appear.</verify>
  <done>Users can choose sessions via a menu.</done>
</task>

</tasks>

<success_criteria>
- [ ] Users can navigate history using a menu.
- [ ] History files contain meaningful titles.
</success_criteria>
