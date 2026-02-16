# RESEARCH.md — Phase 4: Session Persistence & Reliability

## Storage Strategy
- **Location**: `~/.cli-llm/history/`
- **File Format**: JSON array of `ChatMessage` objects.
- **Naming Convention**: `v1-{timestamp}.json` (e.g., `v1-20260215-2130.json`).
- **Permissions**: same as config (0o600).

## UUID / Session ID
- Use `crypto.randomUUID()` available in Bun/Node.

## Implementation Plan
1. **History Manager**: A class to abstract directory management, listing sessions, and reading/writing individual session files.
2. **Session Integration**: Update `Session` component to:
   - Load previous messages if resuming (Future feature, but prep the infra).
   - Save messages to the current session file after every assistant response finishes streaming.

## Success Criteria for Research
- [x] Defined file-based storage format.
- [x] Decided on directory structure.
- [x] Confirmed Bun has necessary primitives.
