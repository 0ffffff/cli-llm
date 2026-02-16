## Phase 2 Verification

### Must-Haves
- [x] **Core API Client**: `KimiClient` implemented with native `fetch` and OpenAI-compatible types. — VERIFIED (evidence: `src/api/kimi.ts`, `src/api/types.ts`)
- [x] **CLI Arg Parsing**: `commander` routes between interactive (placeholder) and one-off modes. — VERIFIED (evidence: `bun index.tsx --help` output)
- [x] **One-off Mode**: Instant queries trigger API call and display result/error. — VERIFIED (evidence: `bun index.tsx "query"` triggers `OneOff` component logic)
- [x] **Clean Exit**: `SIGINT` handled and `useApp().exit()` used in components. — VERIFIED (evidence: `index.tsx` line 42, `one-off.tsx` line 44)

### Verdict: PASS
