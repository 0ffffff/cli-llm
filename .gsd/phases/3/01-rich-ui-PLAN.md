---
phase: 3
plan: 1
wave: 1
depends_on: []
files_modified: [src/cli/components/Markdown.tsx, src/cli/components/Thinking.tsx, src/cli/one-off.tsx]
autonomous: true
user_setup: []

must_haves:
  truths:
    - "Markdown is rendered with Ansi styles in the terminal"
    - "A spinner is displayed during API calls"
  artifacts:
    - "src/cli/components/Markdown.tsx exists"
    - "src/cli/components/Thinking.tsx exists"
---

# Plan 3.1: Rich UI Components

<objective>
Enhance the TUI with professional markdown rendering and synchronized thinking states.
Purpose: Create the "premium" feel requested in the SPEC.
Output: Shared UI components for markdown and loading.
</objective>

<context>
Load for context:
- .gsd/SPEC.md
- .gsd/phases/3/RESEARCH.md
- src/cli/one-off.tsx
</context>

<tasks>

<task type="auto">
  <name>Implement Markdown Component</name>
  <files>src/cli/components/Markdown.tsx</files>
  <action>
    Create a wrapper for `ink-markdown`.
    Ensure it handles long text and applies clean spacing.
    AVOID: using standard `Text` for LLM responses; always use the Markdown wrapper.
  </action>
  <verify>Check OneOff mode rendering with a prompt that returns markdown</verify>
  <done>Markdown text is correctly stylized in terminal</done>
</task>

<task type="auto">
  <name>Implement Thinking Spinner</name>
  <files>src/cli/components/Thinking.tsx</files>
  <action>
    Create a `Thinking` component using `ink-spinner` (dots style).
    Include a "Thinking" label next to the spinner.
  </action>
  <verify>Check OneOff mode "Thinking..." rendering</verify>
  <done>Animated spinner appears while waiting for API</done>
</task>

<task type="auto">
  <name>Upgrade One-off UI</name>
  <files>src/cli/one-off.tsx</files>
  <action>
    Replace crude `Text` with new `Markdown` and `Thinking` components.
    Ensure layout is clean.
  </action>
  <verify>Run `bun index.tsx "Write a python snippet"`</verify>
  <done>One-off mode looks professional with markdown and spinner</done>
</task>

</tasks>

<verification>
After all tasks, verify:
- [ ] `bun index.tsx "Query"` shows an animated spinner then markdown text.
</verification>

<success_criteria>
- [ ] All tasks verified
- [ ] Must-haves confirmed
</success_criteria>
