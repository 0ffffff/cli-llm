# SPEC.md — Project Specification

> **Status**: `FINALIZED`

## Vision
To create a premium-quality, CLI-based chat interface for Kimi k2.5 via NVIDIA Cloud, offering a user experience comparable to Claude Code or ChatGPT but specialized for local terminal efficiency without agentic file-system capabilities.

## Goals
1. **Duo-Mode CLI**: Support both persistent interactive sessions (`llm`) and instant one-off queries (`llm <prompt>`).
2. **Premium TUI**: A rich terminal interface built with React and Ink, providing syntax highlighting, markdown rendering, and interactive elements.
3. **Session Persistence**: Locally cached conversation history allowing users to resume previous chats or start fresh.
4. **Secure Configuration**: First-time API key setup with secure local storage and global LLM setting management.
5. **Zero-Agent Architecture**: Ensure the LLM remains a conversational partner only, with no permissions to modify the user's system or files.

## Non-Goals (Out of Scope)
- **Image Generation**: Focus is strictly on text and markdown.
- **Agentic Capabilities**: No file system modification, shell execution, or external tool use by the LLM.
- **Multi-Model Support**: Initially specialized for Kimi k2.5 (though architecture may allow expansion later).

## Users
Developers and academic researchers who prefer a terminal-centric workflow and want a high-quality LLM interface that doesn't attempt to "do" things on their behalf.

## Constraints
- **Tech Stack**: TypeScript, Node.js, Bun, React (Ink).
- **API**: Kimi k2.5 via NVIDIA Cloud API.
- **Privacy**: API keys and conversation logs must be stored locally and securely.

## Success Criteria
- [ ] Users can run `llm` and interact with Kimi k2.5 in a beautiful, reactive TUI.
- [ ] Users can run `llm "Query text"` and get an immediate formatted response.
- [ ] Conversation history is persisted and accessible across sessions.
- [ ] Markdown and code blocks are rendered with high fidelity in the terminal.
- [ ] API keys are prompted for on first run and safely stored.
