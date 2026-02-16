# RESEARCH.md — Phase 5: Performance & Final Polish

## Binary Compilation
- `bun build --compile --outfile llm ./index.tsx`
- Bun handles embedding assets and runtime.
- For Ink, we need to ensure `signal` handling isn't blocked by the compiler (should be fine in Bun 1.2+).

## Session Resumption
- Since we have `HistoryManager.listSessions()`, we can create a `SessionPicker` component.
- `llm list` or a secondary menu if `llm` is run but a previous session exists.
- Decision: We will implement a `--resume <id>` flag or a positional `resume` command to keep it simple but powerful.

## UX Polish
- **Throttling**: React re-renders on every token can be jerky. We will ensure we aren't overwhelming the terminal with full-screen updates if only a small token changed.
- **Error Handling**: Specific components for "Offline" or "Invalid API Key" instead of raw console logs.

## Success Criteria for Research
- [x] Confirmed `bun build --compile` support for Ink.
- [x] Defined session resumption UI pattern.
- [x] Identified throttling as a potential optimization.
