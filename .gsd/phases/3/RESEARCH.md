# RESEARCH.md — Phase 3: Premium TUI Implementation

## TUI Libraries Selection
- **Markdown Rendering**: `ink-markdown` (cameronhunter/ink-markdown). 
  - Supports standard markdown tags.
  - Renders to terminal Ansi.
- **Thinking State**: `ink-spinner` with `cli-spinners`.
  - Provides various spinner styles (dots, line, etc.).
- **User Input**: `ink-text-input`.
  - Already used in Onboarding, will be the core of the chat prompt.

## Architecture: Interactive Session
The `Session` component will be a state machine:
- `messages`: `ChatMessage[]` - Local state for the current conversation.
- `status`: `'idle' | 'busy' | 'error'` - Controls whether to show the input prompt or the spinner.
- `input`: `string` - The current line being typed.

### Component Structure
```
<App>
  <Box flexDirection="column">
    <ScrollableHistory messages={messages} />
    {status === 'busy' ? <Thinking /> : <Prompt input={input} />}
  </Box>
</App>
```

## Challenges
- **Terminal Height**: Ink handles re-renders well, but very long conversations might overflow without a scrollback mechanism. For MVP, we will rely on terminal scrollback or simple vertical stacking.
- **Streaming**: React state updates for every token might be expensive for TUI. We will implement basic non-streaming first, then optimize for streaming if time allows.
