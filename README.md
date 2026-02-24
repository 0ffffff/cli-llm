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

### Commands

#### Interactive Chat
Start a new interactive chat session:
```bash
llm
```
If you did not move the binary onto your PATH, run:
```bash
./llm
```

#### One-Off Prompt
Quickly ask a question without entering interactive mode (output is printed to stdout):
```bash
llm "Explain quantum computing in 50 words"
llm What is the capital of France?
```

#### Resume a Session
Resume a specific session by ID:
```bash
llm --resume <sessionId>
llm -r <sessionId>
```

#### Select a Session
Interactively select from recent sessions to resume:
```bash
llm --select
llm -s
```

#### Select Provider / Model
Interactively select a model (and its provider) to use for subsequent runs:
```bash
llm --model
llm -m
```
This updates `provider`, `model`, and the appropriate API key in `~/.cli-llm/config.json`. If no API key exists yet for the chosen provider, you will be prompted to enter one.

#### List Sessions
List all recent chat sessions with timestamps:
```bash
llm list
```
Shows the 20 most recent sessions with their IDs, names, and last modified times.

#### Reset Everything
Delete all conversation history and reset (prompts for confirmation):
```bash
llm reset
```
⚠️ **Warning**: This will permanently delete ALL conversation history. Configuration file will be preserved.

#### Help & Version
Show help information:
```bash
llm --help
llm -h
```

Show version:
```bash
llm --version
llm -V
```

### Configuration
If `LLM_API_KEY` or `LLM_BASE_URL` is missing, `llm` will open an interactive configuration screen to collect:
- API key
- Endpoint URL
- Model name

Please ensure that these are accurate! The TUI will not function properly if these are malformed.

Keys and settings are stored in `~/.cli-llm/config.json` (you can edit it manually if needed).

At runtime the CLI is **provider-agnostic** and uses a small factory to select the appropriate gateway client:
- `provider: "nim"` → NVIDIA NIM / any OpenAI-compatible HTTP chat-completions endpoint (uses `baseUrl`).
- `provider: "cerebras"` → Cerebras Cloud via `@cerebras/cerebras_cloud_sdk` (ignores `baseUrl`, uses the configured `model`).

The config file stores API keys per provider in `apiKeys`:
```jsonc
{
  "apiKeys": {
    "nim": "NIM_API_KEY",
    "cerebras": "CEREBRAS_API_KEY"
  },
  "provider": "nim",
  "model": "your-model-id",
  "baseUrl": "https://your-endpoint.example/v1/chat/completions"
}
```

You can also configure via environment variables:
```bash
export LLM_API_KEY="your-api-key"
export LLM_BASE_URL="https://your-endpoint.example/v1/chat/completions"
export LLM_MODEL="your-model-id"
export LLM_PROVIDER_NAME="nim"  # or "cerebras"; provider ID used by the client
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