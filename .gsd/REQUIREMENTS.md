# REQUIREMENTS.md

## Format
| ID | Requirement | Source | Status |
|----|-------------|--------|--------|
| REQ-01 | **Package Management**: Use Bun for all dependency and execution tasks. | Tech Stack | Pending |
| REQ-02 | **Rich UI**: Implement TUI using React and Ink with support for Markdown, bold/italic text, and code syntax highlighting. | SPEC Goal 2 | Pending |
| REQ-03 | **Thinking Indicators**: Display a "thinking" spinner or animation while waiting for API responses. | SPEC Goal 2 | Pending |
| REQ-04 | **Interactive Mode**: `llm` command enters a full-screen interactive session with prompt/response loop. | SPEC Goal 1 | Pending |
| REQ-05 | **One-off Mode**: `llm <prompt>` prints the response directly to stdout and exits. | SPEC Goal 1 | Pending |
| REQ-06 | **Persistence**: Store conversation logs in a local cache (e.g., SQLite or JSON files in user config dir). | SPEC Goal 3 | Pending |
| REQ-07 | **Session Management**: Allow users to list and resume previous conversations when starting `llm`. | SPEC Goal 3 | Pending |
| REQ-08 | **Configuration Management**: A global config file (e.g., `~/.cli-llm/config.json`) for LLM settings and API keys. | SPEC Goal 4 | Pending |
| REQ-09 | **First-run Onboarding**: Prompt for API key if not found in configuration. | SPEC Goal 4 | Pending |
| REQ-10 | **API Integration**: Integrate Kimi k2.5 via NVIDIA Cloud's OpenAI-compatible API or specific SDK. | SPEC Goal 5 | Pending |
| REQ-11 | **Isolation**: One-off queries must not be saved to history but should respect global settings. | SPEC Goal 1 | Pending |
| REQ-12 | **Escape Hatch**: Support `Ctrl-C` to gracefully exit sessions. | SPEC Goal 1 | Pending |
