---
phase: 1
plan: 3
wave: 3
depends_on: [2]
files_modified: [src/cli/onboarding.tsx, index.ts]
autonomous: true
user_setup: []

must_haves:
  truths:
    - "New users are prompted for an API key on first run"
    - "The CLI initializes the config if missing"
  artifacts:
    - "index.ts checks for config and triggers onboarding if needed"
---

# Plan 1.3: Onboarding CLI

<objective>
Build the initial CLI entry point and onboarding experience.
Purpose: Ensure users are set up with an API key before attempting LLM interactions.
Output: Initial index.ts and onboarding React/Ink component.
</objective>

<context>
Load for context:
- .gsd/SPEC.md
- src/config/manager.ts
</context>

<tasks>

<task type="auto">
  <name>Implement Onboarding UI</name>
  <files>src/cli/onboarding.tsx</files>
  <action>
    Create a React component using Ink that:
    - Greets the user.
    - Explains that an NVIDIA API key is required.
    - Uses `ink-text-input` (if available) or similar to capture the key.
    - Saves the key using the `ConfigManager`.
  </action>
  <verify>Run the script and see the prompt</verify>
  <done>Key entered in UI is saved to config file</done>
</task>

<task type="auto">
  <name>Entry Point Orchestration</name>
  <files>index.ts</files>
  <action>
    Modify the main entry point to:
    - Check if the API key exists in the config.
    - If missing, render the Onboarding UI.
    - If present, print a placeholder "Ready" message.
  </action>
  <verify>Delete config file and run `bun index.ts` -> see prompt. Run again -> see "Ready"</verify>
  <done>Conditional logic for registration vs execution works</done>
</task>

</tasks>

<verification>
After all tasks, verify:
- [ ] Fresh install behavior works (prompted)
- [ ] Existing user behavior works (no prompt)
</verification>

<success_criteria>
- [ ] All tasks verified
- [ ] Must-haves confirmed
</success_criteria>
