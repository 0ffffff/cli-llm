# cli-llm

A premium, immersive command-line interface for AI chat. Supports **Kimi (Moonshot AI)**, **OpenAI**, **Anthropic**, and more.

Built with [Bun](https://bun.sh) and [React Ink](https://github.com/vadimdemedes/ink).

## Features

- **Immersive UI**: Full-screen, distraction-free terminal interface with isolate history (alternate screen buffer).
- **Markdown Support**: Syntax highlighting, tables, and formatted text rendering directly in your terminal.
- **Streaming Responses**: Real-time token streaming for a responsive experience.
- **Session Management**: Automatically saves chat history. Resume past conversations or start fresh.
- **Mouse Support**: Scroll through chat history using your mouse wheel.
- **Secure**: API keys are stored locally in `~/.cli-llm/config.json`.

## Installation

### Download Binary
Download the latest pre-compiled binary for your system from the [Releases](https://github.com/your-username/cli-llm/releases) page.

1. Download `llm` (for macOS/Linux).
2. Make it executable:
   ```bash
   chmod +x llm
   ```
3. Move it to your path:
   ```bash
   sudo mv llm /usr/local/bin/
   ```

### Compile from Source

Prerequisites: [Bun](https://bun.sh) installed.

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/cli-llm.git
   cd cli-llm
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Build the binary:
   ```bash
   bun run build
   ```
   This will create a standalone `llm` executable in the project directory.

## Usage

### Interactive Chat
Start a new session:
```bash
llm
```

### One-Off Prompt
Quickly ask a question without entering interactive mode (output is printed to stdout):
```bash
llm "Explain quantum computing in 50 words"
```

### Resume a Session
List recent sessions:
```bash
llm list
```

Resume a specific session:
```bash
llm --resume session-id
```

Interactively select a session to resume:
```bash
llm --select
```

### Configuration
The first time you run `llm`, it will ask for your API Key.
Keys are stored in `~/.cli-llm/config.json`.

You can also set the API key via environment variable:
```bash
export LLM_API_KEY="your-api-key"
```

To reset configuration and history:
```bash
llm reset
```

## Tech Stack
- **Runtime**: Bun
- **UI Framework**: React + Ink
- **API Client**: Native `fetch` with streaming support
