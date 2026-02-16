# RESEARCH.md — Phase 6: Ease-of-Use & Customization

## Terminal Management (Alternate Buffer)
- **Problem**: Users want a clean interface that clear the screen and doesn't clutter scroll-back history.
- **Solution**: Use the "Alternate Screen Buffer" ANSI escape codes.
  - Enter: `\x1B[?1049h`
  - Exit: `\x1B[?1049l`
- Implementation: In `index.tsx`, before call to `render`, write the enter code. After the promise resolves or on `SIGINT`, write the exit code.

## Interactive Selection
- **Component**: `ink-select-input`.
- **Usage**: Displaying recent sessions. Each session will need a "name" (calculated from first user message) for the label.

## Model Detection & Configuration
- **Detection Logic**:
  - `nvapi-...` -> NVIDIA (Kimi k2.5 via NVIDIA Cloud)
  - `sk-ant-...` -> Anthropic (Claude)
  - `sk-...` -> OpenAI (ChatGPT)
- **UI Dynamics**:
  - Update `AppConfig` to store `provider` and `model`.
  - Update `KimiClient` to `UnifiedClient` or similar that handles different base URLs if needed (though user specifically mentioned NVIDIA Cloud compatibility earlier). *Wait*, Kimi is specifically Moonshot on NVIDIA. If they want ChatGPT, the base URL changes.

## Global "Reset" Command
- **Action**: `llm reset`.
- **Logic**: Prompt for confirmation (using a simple Ink prompt), then `fs.rmSync(HISTORY_DIR, { recursive: true, force: true })`.

## Onboarding
- **Logic**: Check for `NVIDIA_API_KEY` (or `LLM_API_KEY`) env var. If exists, use it. If not, check config file. If not, prompt.

## Checklist for Success
- [ ] Alternate buffer working (clean terminal on entry/exit).
- [ ] Interactive picker for `llm --resume`.
- [ ] Auto-generate session names from the first message.
- [ ] Multi-model support (labels updated based on API key).
