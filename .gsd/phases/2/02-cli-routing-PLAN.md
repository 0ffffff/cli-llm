---
phase: 2
plan: 2
wave: 2
depends_on: [1]
files_modified: [index.tsx, src/cli/one-off.tsx]
autonomous: true
user_setup: []

must_haves:
  truths:
    - "Differentiates between no-arg 'llm' and 'llm <prompt>'"
    - "One-off queries print formatted output and exit without saving to cache"
    - "Ctrl-C terminates the process cleanly"
  artifacts:
    - "index.tsx uses commander to route to correct mode"
---

# Plan 2.2: CLI Routing & One-off Mode

<objective>
Implement the primary CLI entry point logic and the one-off execution mode.
Purpose: Provide the foundational user interaction patterns.
Output: Integrated index.tsx and src/cli/one-off.tsx.
</objective>

<context>
Load for context:
- .gsd/SPEC.md
- src/api/kimi.ts
- index.tsx
</context>

<tasks>

<task type="auto">
  <name>CLI Argument Routing</name>
  <files>index.tsx</files>
  <action>
    Integrate `commander` to:
    - Accept a variadic argument for the prompt.
    - If arguments are present, join them and trigger One-off mode.
    - If no arguments are present (and key exists), trigger Interactive mode (placeholder for now).
    - Handle global version and help flags.
  </action>
  <verify>Run `bun index.tsx --help` and `bun index.tsx "test"`</verify>
  <done>Process routes correctly based on input</done>
</task>

<task type="auto">
  <name>Implement One-off Execution</name>
  <files>src/cli/one-off.tsx</files>
  <action>
    Create a component or function that:
    - Displays a "Thinking..." indicator (using Ink).
    - Calls `kimi.sendMessage`.
    - Renders the result using Markdown (basic text for now, full markdown in Phase 3).
    - Exits the process once complete.
    AVOID: saving this specific interaction to the session history cache.
  </action>
  <verify>Run `bun index.tsx "Who are you?"` -> see response and exit</verify>
  <done>One-off mode fulfills request and terminates</done>
</task>

<task type="auto">
  <name>Process Management (Ctrl-C)</name>
  <files>index.tsx</files>
  <action>
    Listen for `SIGINT` and ensuring the Ink app unmounts cleanly.
  </action>
  <verify>Start the app and hit Ctrl-C</verify>
  <done>Process exits gracefully without terminal corruption</done>
</task>

</tasks>

<verification>
After all tasks, verify:
- [ ] `llm "test"` works.
- [ ] `llm` (with key) prints a placeholder for session.
- [ ] Ctrl-C works.
</verification>

<success_criteria>
- [ ] All tasks verified
- [ ] Must-haves confirmed
</success_criteria>
