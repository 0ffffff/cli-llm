---
phase: 5
plan: 2
wave: 2
depends_on: [1]
files_modified: [package.json, index.tsx, src/cli/components/Thinking.tsx]
autonomous: true
user_setup: []

must_haves:
  truths:
    - "Application can be built into a standalone binary"
    - "UI handles terminal resizing gracefully (basic re-render)"
  artifacts:
    - "A compiled 'llm' binary exists in the project root"
---

# Plan 5.2: Final Polish & Build

<objective>
Apply final UX polish and prepare the application for distribution.
Purpose: Requirement REQ-14 (Premium Experience) and REQ-15 (Launch).
Output: Compiled binary and polished components.
</objective>

<context>
Load for context:
- package.json
- tsconfig.json
- src/cli/components/Thinking.tsx
</context>

<tasks>

<task type="auto">
  <name>UX Polish: Spacing & UI</name>
  <files>src/cli/components/Thinking.tsx, src/cli/session.tsx</files>
  <action>
    - Ensure clean margins between KIMI and YOU labels.
    - Add a subtle border or separator between messages if it helps clarity.
    - Polish the "Thinking" state to be less jarring.
  </action>
  <verify>Visual inspection</verify>
  <done>UI feels premium and organized</done>
</task>

<task type="auto">
  <name>Build: Standalone Binary</name>
  <files>package.json</files>
  <action>
    - Add a `build` script to `package.json`: `bun build --compile --outfile llm ./index.tsx`.
    - Run the build.
    - Verify the binary `llm` runs independently.
  </action>
  <verify>Run `./llm --version`</verify>
  <done>Single executable binary created</done>
</task>

</tasks>

<verification>
After all tasks, verify:
- [ ] Binary works.
- [ ] No crashes on exit.
</verification>

<success_criteria>
- [ ] All tasks verified
- [ ] Must-haves confirmed
</success_criteria>
