import * as React from 'react';
import { useState, useEffect, useMemo } from 'react';
import { Box, Text, useStdout, useInput } from 'ink';
import { KimiClient } from '../api/kimi.js';
import { HistoryManager } from '../history/manager.js';
import { Markdown } from './components/Markdown.js';
import { Thinking } from './components/Thinking.js';
import { ChatInput } from './components/ChatInput.js';
import { Footer } from './components/Footer.js';
import type { AppConfig } from '../config/types.js';
import type { ChatMessage } from '../api/types.js';

interface SessionProps {
    config: AppConfig;
    sessionId: string;
}

export const Session: React.FC<SessionProps> = ({ config, sessionId }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [status, setStatus] = useState<'idle' | 'busy' | 'streaming' | 'error' | 'loading'>('loading');
    const [error, setError] = useState<string | null>(null);
    const [scrollTop, setScrollTop] = useState(0);

    const { stdout } = useStdout();
    const width = stdout?.columns || 80;
    const height = stdout?.rows || 24;

    // Viewport height: leave room for header (2) and input/footer (4)
    const viewHeight = Math.max(5, height - 6);

    // Handle Input (keystrokes) and Scroll
    useInput((inputData, key) => {
        // Handle Mouse Wheel (SGR mode) or any unhandled ESC sequences
        if (inputData.startsWith('\x1b')) {
            if (inputData.includes('64;')) setScrollTop(s => Math.max(0, s - 1));
            if (inputData.includes('65;')) setScrollTop(s => s + 1);
            // Always return for ESC sequences to prevent them from hitting other hooks/components
            return;
        }

        if (key.pageUp) setScrollTop(s => Math.max(0, s - 10));
        if (key.pageDown) setScrollTop(s => s + 10);
    });

    useEffect(() => {
        async function load() {
            try {
                const history = await HistoryManager.loadSession(sessionId);
                if (history.length > 0) {
                    setMessages(history);
                }
                setStatus('idle');
            } catch (err) {
                console.error('Failed to load history:', err);
                setStatus('idle');
            }
        }
        load();
    }, [sessionId]);

    const [streamingContent, setStreamingContent] = useState('');

    const handleSubmit = async (value: string) => {
        if (!value.trim()) return;

        const userMessage: ChatMessage = { role: 'user', content: value };
        const historyWithUser = [...messages, userMessage];

        setMessages(historyWithUser);
        setInput('');
        setStatus('busy');
        setError(null);
        setScrollTop(0); // Jump to top? Or maybe stay where we are. Logic for "follow bottom" could be added.

        try {
            const client = new KimiClient(config.apiKey!, config.model, config.baseUrl);
            const apiMessages: ChatMessage[] = [
                { role: 'system', content: config.defaultSystemPrompt },
                ...historyWithUser
            ];

            const stream = client.sendMessageStream(apiMessages);
            let assistantContent = '';
            let started = false;

            for await (const chunk of stream) {
                if (!started) {
                    setStatus('streaming');
                    started = true;
                }
                assistantContent += chunk;
                setStreamingContent(assistantContent);
            }

            const finalMessages: ChatMessage[] = [...historyWithUser, { role: 'assistant', content: assistantContent }];
            await HistoryManager.saveSession(sessionId, finalMessages);
            await HistoryManager.cleanup(config.historyLimit);
            setMessages(finalMessages);
            setStreamingContent('');
            setStatus('idle');
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
            setStreamingContent('');
            setStatus('error');
        }
    };

    const providerName = config.provider || 'AI';

    return (
        <Box flexDirection="column" width={width} height={height} paddingX={1} paddingTop={1}>
            {/* Header */}
            <Box marginBottom={1} flexShrink={0}>
                <Text color="blue" bold>● {providerName}</Text>
                <Text color="gray" dimColor> | {sessionId}</Text>
                {scrollTop > 0 && <Text color="yellow"> (Scrolled UP)</Text>}
            </Box>

            {/* Content Viewport */}
            <Box flexDirection="column" flexGrow={1} height={viewHeight} overflow="hidden">
                <Box flexDirection="column" marginTop={-scrollTop}>
                    {messages.map((msg, index) => (
                        <Box key={index} flexDirection="column" marginBottom={1}>
                            <Box>
                                <Text bold color={msg.role === 'user' ? 'green' : 'cyan'}>
                                    {msg.role === 'user' ? '[YOU]' : `[${providerName.toUpperCase()}]`}
                                </Text>
                            </Box>
                            <Box paddingLeft={2}>
                                <Markdown>{msg.content}</Markdown>
                            </Box>
                        </Box>
                    ))}

                    {status === 'loading' && (
                        <Box>
                            <Thinking />
                            <Text> Resuming...</Text>
                        </Box>
                    )}

                    {status === 'busy' && (
                        <Box>
                            <Thinking />
                        </Box>
                    )}

                    {status === 'streaming' && streamingContent && (
                        <Box flexDirection="column" marginBottom={1}>
                            <Box>
                                <Text bold color="cyan">
                                    [{providerName.toUpperCase()}]
                                </Text>
                            </Box>
                            <Box paddingLeft={2}>
                                <Markdown>{streamingContent}</Markdown>
                            </Box>
                        </Box>
                    )}
                </Box>
            </Box>

            {/* Footer / Input */}
            <Box flexDirection="column" marginTop={1} flexShrink={0}>
                {status === 'error' && (
                    <Box marginBottom={1}>
                        <Text color="red">Error: {error}</Text>
                    </Box>
                )}

                <Box borderStyle="single" borderColor="gray" paddingX={1}>
                    <Box marginRight={1}>
                        <Text color="green">❯</Text>
                    </Box>
                    <ChatInput
                        value={input}
                        onChange={setInput}
                        onSubmit={handleSubmit}
                        placeholder={status === 'busy' ? "..." : "Message..."}
                        focus={status !== 'busy'}
                    />
                </Box>
                <Footer />
            </Box>
        </Box>
    );
};
