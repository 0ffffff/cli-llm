## Phase 1 Verification

### Must-Haves
- [x] **Package Management**: Bun is used and dependencies (React, Ink) are installed. — VERIFIED (evidence: `package.json`, `bun.lock`)
- [x] **Configuration Management**: Global config file handled at `~/.cli-llm/config.json`. — VERIFIED (evidence: `test-config.ts` passes)
- [x] **First-run Onboarding**: UI prompts for API key if missing. — VERIFIED (evidence: implementation in `index.tsx` and `onboarding.tsx`)

### Verdict: PASS
