# RESEARCH.md — Phase 2: Core API & CLI Skeleton

## NVIDIA Cloud API (Kimi k2.5)
- **Base URL**: `https://integrate.api.nvidia.com/v1`
- **Model Name**: `moonshotai/kimi-k2.5`
- **Compatibility**: OpenAI compatible REST API.
- **Authentication**: Bearer token via `Authorization` header.

## CLI Argument Parsing
- **Library**: `commander` (already installed in Phase 1).
- **Patterns**:
  - `llm` -> No arguments, opens interactive session.
  - `llm <prompt>` -> Positional argument, triggers one-off query.

## Implementation Details
- Use `openai` npm package or simple `fetch` for API calls to keep dependencies light. Since `bun` has built-in `fetch`, and the user asked for Bun specifically, using `fetch` directly is very efficient and avoids another dependency.
- One-off queries should bipass history logic but still use common config.

## Success Criteria for Research
- [x] Identified Kimi k2.5 endpoint.
- [x] Confirmed OpenAI compatibility.
- [x] Decided on `fetch` for implementation.
