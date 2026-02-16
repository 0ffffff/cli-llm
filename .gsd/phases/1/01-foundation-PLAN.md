---
phase: 1
plan: 1
wave: 1
depends_on: []
files_modified: [package.json, tsconfig.json]
autonomous: true
user_setup: []

must_haves:
  truths:
    - "Bun is used to manage dependencies"
    - "Ink and React are installed and configured for TUI"
  artifacts:
    - "package.json contains ink and react"
    - "tsconfig.json supports JSX (React)"
---

# Plan 1.1: Environment & Dependency Foundation

<objective>
Establish the core technical foundation for the project using Bun, React, and Ink.
Purpose: Ensure the build system and TUI library are ready for development.
Output: Validated package.json and tsconfig.json.
</objective>

<context>
Load for context:
- .gsd/SPEC.md
- package.json
- tsconfig.json
</context>

<tasks>

<task type="auto">
  <name>Install Core Dependencies</name>
  <files>package.json</files>
  <action>
    Use Bun to install the following dependencies:
    - react
    - ink
    - commander (for CLI argument parsing)
    - @types/react (dev)
    - chalk (for colors in onboarding)
    AVOID: installing with npm or pnpm; use `bun add`.
  </action>
  <verify>bun pm list</verify>
  <done>Dependencies listed in package.json</done>
</task>

<task type="auto">
  <name>Configure TypeScript for React/Ink</name>
  <files>tsconfig.json</files>
  <action>
    Ensure tsconfig.json includes:
    - "jsx": "react-jsx"
    - "baseUrl": "."
    - "module": "ESNext"
    - "target": "ESNext"
    - "moduleResolution": "bundler"
  </action>
  <verify>bun index.ts (simple test file)</verify>
  <done>TS compilation works for a basic JSX snippet</done>
</task>

</tasks>

<verification>
After all tasks, verify:
- [ ] `bun install` completes without error
- [ ] `tsc --noEmit` passes with a simple React/Ink file
</verification>

<success_criteria>
- [ ] All tasks verified
- [ ] Must-haves confirmed
</success_criteria>
