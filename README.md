# cli-llm

A command-line interface for AI chat that is **model-agnostic**: bring your own API key, endpoint URL, and model name.

Built with [Bun](https://bun.sh) and [React Ink](https://github.com/vadimdemedes/ink).

## Features

- **Immersive UI**: Full-screen, distraction-free terminal interface via an alternate screen buffer.
- **Markdown Rendering**: Renders Markdown-formatted responses directly in your terminal.
- **Streaming Responses**: Real-time token streaming for a responsive experience.
- **Session Management**: Automatically saves chat history. Resume past conversations or start fresh.
- **Mouse Support**: Scroll through chat history using your mouse wheel (supported terminals).
- **Model Labeling**: Session header shows the configured model name.
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
If `LLM_API_KEY` or `LLM_BASE_URL` is missing, `llm` will open an interactive configuration screen to collect:
- API key
- Endpoint URL
- Model name

Please ensure that these are accurate! The TUI will not function properly if these are malformed.

Keys and settings are stored in `~/.cli-llm/config.json` (you can edit it manually if needed).

You can also configure via environment variables:
```bash
export LLM_API_KEY="your-api-key"
export LLM_BASE_URL="https://your-endpoint.example/v1/chat/completions"
export LLM_MODEL="your-model-id"
export LLM_PROVIDER_NAME="AI"  # optional label shown in the header
```

#### Endpoint compatibility
This CLI expects an OpenAI-style “chat completions” endpoint that accepts JSON like:
- `model: string`
- `messages: { role: 'system' | 'user' | 'assistant', content: string }[]`
- `stream: boolean`

For streaming, it expects server-sent events with lines like `data: {...}` and a final `data: [DONE]`.

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