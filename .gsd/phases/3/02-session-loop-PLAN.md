---
phase: 3
plan: 2
wave: 2
depends_on: [1]
files_modified: [src/cli/session.tsx, index.tsx]
autonomous: true
user_setup: []

must_haves:
  truths:
    - "Users can have a back-and-forth conversation with Kimi"
    - "New messages append to the history view"
    - "Input resets after sending"
  artifacts:
    - "src/cli/session.tsx exists and manages state"
---

# Plan 3.2: Interactive Session Loop

<objective>
Implement the full interactive chat experience for multi-turn conversations.
Purpose: Core functionality for persistent chat sessions.
Output: src/cli/session.tsx
</objective>

<context>
Load for context:
- .gsd/SPEC.md
- src/cli/one-off.tsx
- index.tsx
</context>

<tasks>

<task type="auto">
  <name>Implement Session Component</name>
  <files>src/cli/session.tsx</files>
  <action>
    Create a stateful `Session` component that:
    - Maintains an array of `ChatMessage`.
    - Uses `ink-text-input` for the user prompt.
    - Captures input, adds to history, calls `KimiClient`, and appends response.
    - Transitions between 'idle' and 'busy' status to show/hide the prompt and spinner.
    - Exists in an infinite loop until Ctrl-C or an internal /exit command (optional).
    AVOID: re-rendering the entire history list inefficiently; use stable keys for message components.
  </action>
  <verify>Run the app in interactive mode and send two messages in a row</verify>
  <done>Multi-turn conversation works correctly with state preservation</done>
</task>

<task type="auto">
  <name>Integrate Session into Entry Point</name>
  <files>index.tsx</files>
  <action>
    Replace the "Interactive session mode placeholder" in `index.tsx` with the `<Session />` component.
    Pass down the configuration properly.
  </action>
  <verify>Run `bun index.tsx` (with key existing)</verify>
  <done>App enters interactive chat loop on startup</done>
</task>

</tasks>

<verification>
After all tasks, verify:
- [ ] Conversation history is visible during the session.
- [ ] User can send multiple prompts.
</verification>

<success_criteria>
- [ ] All tasks verified
- [ ] Must-haves confirmed
</success_criteria>
