# cli-llm

A command-line interface for AI chat. Supports **Kimi (Moonshot AI)**, **OpenAI**, **Anthropic**, and more.

Built with [Bun](https://bun.sh) and [React Ink](https://github.com/vadimdemedes/ink).

## Features

- **Immersive UI**: Full-screen, distraction-free terminal interface via an alternate screen buffer.
- **Markdown Rendering**: Renders Markdown-formatted responses directly in your terminal.
- **Streaming Responses**: Real-time token streaming for a responsive experience.
- **Session Management**: Automatically saves chat history. Resume past conversations or start fresh.
- **Mouse Support**: Scroll through chat history using your mouse wheel (supported terminals).
- **Local Storage**: Stores configuration at `~/.cli-llm/config.json` and chat history under `~/.cli-llm/history/` (files are written with `0600` permissions).

## Installation

Prerequisites: [Bun](https://bun.sh) installed.

1. Clone the repository:
   ```bash
   git clone <this-repo>
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

4. (Optional) Put it on your PATH:
   ```bash
   sudo mv ./llm /usr/local/bin/llm
   ```

## Usage

### Interactive Chat
Start a new session:
```bash
llm
```
If you did not move the binary onto your PATH, run:
```bash
./llm
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

You can also set the API key via environment variable (either works):
```bash
export LLM_API_KEY="your-api-key"
export NVIDIA_API_KEY="your-api-key"
```

To reset configuration and history:
```bash
llm reset
```

## Tech Stack
- **Runtime**: Bun
- **UI Framework**: React + Ink
- **API Client**: Native `fetch` with streaming support

## Acknowledgements
This project was made entirely through agents provided via Google Antigravity and Chad IDE. I did not write a single line of code.  