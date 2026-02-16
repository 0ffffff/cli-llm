---
phase: 3
plan: 3
wave: 3
depends_on: [2]
files_modified: [src/api/kimi.ts, src/cli/session.tsx, src/cli/one-off.tsx]
autonomous: true
user_setup: []

must_haves:
  truths:
    - "Responses appear token-by-token in the terminal"
    - "Streaming doesn't break Markdown formatting during partial updates"
  artifacts:
    - "KimiClient.sendMessage support stream: true"
---

# Plan 3.3: Streaming Responses

<objective>
Implement real-time token streaming to make the interface feel alive and premium.
Purpose: Match the UX quality of Claude Code and ChatGPT.
Output: Streaming-enabled client and reactive UI.
</objective>

<context>
Load for context:
- src/api/kimi.ts
- src/api/types.ts
- src/cli/session.tsx
</context>

<tasks>

<task type="auto">
  <name>Implement Streaming in KimiClient</name>
  <files>src/api/kimi.ts</files>
  <action>
    Add a `sendMessageStream` method that returns an `AsyncIterableIterator<string>`.
    Use `response.body.getReader()` to parse the Server-Sent Events (SSE) from NVIDIA.
    Correct handling of 'data: [DONE]' and JSON parsing per line.
    AVOID: buffering the whole response; yield tokens as they arrive.
  </action>
  <verify>Check client yields multiple times for a single long response</verify>
  <done>Tokens are yielded in real-time from the API</done>
</task>

<task type="auto">
  <name>Implement Streaming in UI</name>
  <files>src/cli/session.tsx, src/cli/one-off.tsx</files>
  <action>
    Update `Session` and `OneOff` to use the new streaming method.
    When a new stream starts, append an empty assistant message and update its content as tokens arrive.
    The spinner should disappear as soon as the first token arrives.
  </action>
  <verify>Run `bun index.tsx "Write a long story"` -> see it typing live</verify>
  <done>Terminal UI shows live typing effect for LLM responses</done>
</task>

</tasks>

<verification>
After all tasks, verify:
- [ ] Response starts appearing before the API call finishes.
</verification>

<success_criteria>
- [ ] All tasks verified
- [ ] Must-haves confirmed
</success_criteria>
