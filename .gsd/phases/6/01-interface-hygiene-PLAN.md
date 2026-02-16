---
phase: 6
plan: 1
wave: 1
---

# Plan 6.1: Interface Hygiene

<objective>
Implement terminal environment management and dynamic model labelling.
Output: Support for alternate screen buffer, environment variable API keys, and model-specific UI labels.
</objective>

<context>
- .gsd/phases/6/RESEARCH.md
- index.tsx
- src/cli/session.tsx
- src/config/manager.ts
</context>

<tasks>

<task type="auto">
  <name>Implement Alternate Screen Buffer</name>
  <files>index.tsx</files>
  <action>
    - Before calling `render`, output `\x1B[?1049h` to enter the alternate buffer.
    - Ensure `\x1B[?1049l` is output on all exit paths (after promise, and in SIGINT).
    - Clear the terminal on entry for a "fresh" feel.
  </action>
  <verify>Run the app; terminal should be cleared and history restored on exit.</verify>
  <done>Alternate buffer prevents scroll-up history leakage.</done>
</task>

<task type="auto">
  <name>Environment & Model Detection</name>
  <files>src/config/manager.ts, src/config/types.ts, index.tsx, src/cli/session.tsx</files>
  <action>
    - Update `ConfigManager.load` to check for `process.env.NVIDIA_API_KEY` or `LLM_API_KEY` before reading file.
    - Implement a helper `detectProvider(apiKey: string): string` (NVIDIA, OpenAI, Anthropic).
    - Update `Session` and `OneOff` components to display the provider name in the header.
  </action>
  <verify>Run with different keys; UI should update its labels.</verify>
  <done>Labels dynamic based on detected API key.</done>
</task>

</tasks>

<success_criteria>
- [ ] Terminal is clean on entry and restored on exit.
- [ ] UI labels say "Kimi Session", "OpenAI Session", etc.
</success_criteria>
