---
phase: 2
plan: 1
wave: 1
depends_on: []
files_modified: [src/api/kimi.ts, src/api/types.ts]
autonomous: true
user_setup: []

must_haves:
  truths:
    - "Can communicate with NVIDIA Kimi k2.5 API using fetch"
    - "API responses are correctly typed"
  artifacts:
    - "src/api/kimi.ts exists and exports a sendMessage function"
---

# Plan 2.1: Kimi API Client

<objective>
Implement the core API client for communicating with Kimi k2.5 on NVIDIA Cloud.
Purpose: Abstract the API complexities and provide a clean interface for the TUI.
Output: src/api/kimi.ts
</objective>

<context>
Load for context:
- .gsd/phases/2/RESEARCH.md
- .gsd/SPEC.md
- src/config/manager.ts
</context>

<tasks>

<task type="auto">
  <name>Define API Types</name>
  <files>src/api/types.ts</files>
  <action>
    Define types for Chat Message, Chat Completion Request, and Chat Completion Response.
    Follow the OpenAI standard as it's what NVIDIA NIM uses.
  </action>
  <verify>Check types match OpenAI spec</verify>
  <done>Types defined for request and response</done>
</task>

<task type="auto">
  <name>Implement Kimi Client</name>
  <files>src/api/kimi.ts</files>
  <action>
    Create a `KimiClient` class or functional exported wrapper that:
    - Takes `apiKey` and `model` from config.
    - Uses `fetch` to send POST requests to `https://integrate.api.nvidia.com/v1/chat/completions`.
    - Supports streaming if possible (essential for "premium UI" feel later), but start with non-streaming or basic streaming setup.
    - Handlers errors (invalid key, rate limit).
    AVOID: using heavy SDKs; use native `fetch`.
  </action>
  <verify>Run a hidden test script to call the API (manual verify by human if needed, or mock in CI)</verify>
  <done>Client successfully sends a message and returns a string response</done>
</task>

</tasks>

<verification>
After all tasks, verify:
- [ ] `src/api/kimi.ts` is syntactically correct.
- [ ] Exported function accepts an array of messages and returns a response.
</verification>

<success_criteria>
- [ ] All tasks verified
- [ ] Must-haves confirmed
</success_criteria>
