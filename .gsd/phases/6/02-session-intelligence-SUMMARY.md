# Plan 6.2 Summary: Session Intelligence

## Accomplishments
- Upgraded `HistoryManager` to store sessions as `{name, messages}` objects.
- Session names auto-generated from first user message (first 60 chars).
- Backward-compatible with old plain array format.
- Added `listSessionsDetailed()` for metadata-rich listings.
- Created `SessionPicker` component using `ink-select-input`.
- `llm --select` opens interactive picker. `llm list` shows names and timestamps.

## Verification
- `bun index.tsx list` shows sessions with names and dates.
- `bun index.tsx --help` shows `--select` flag.
