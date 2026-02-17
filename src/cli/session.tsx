import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { Box, Text, useStdout, useInput, measureElement, type DOMElement } from 'ink';
import { MouseProvider } from '@zenobius/ink-mouse';
import { KimiClient } from '../api/kimi.js';
import { HistoryManager } from '../history/manager.js';
import { Markdown } from './components/Markdown.js';
import { Thinking } from './components/Thinking.js';
import { ChatInput } from './components/ChatInput.js';
import { Footer } from './components/Footer.js';
import { MouseScrollManager } from './components/MouseScrollManager.js';
import type { AppConfig } from '../config/types.js';
import type { ChatMessage } from '../api/types.js';

interface SessionProps {
    config: AppConfig;
    sessionId: string;
}

export const Session: React.FC<SessionProps> = (props) => {
    return (
        <MouseProvider>
            <SessionInner {...props} />
        </MouseProvider>
    );
};

const SessionInner: React.FC<SessionProps> = ({ config, sessionId }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [status, setStatus] = useState<'idle' | 'busy' | 'streaming' | 'error' | 'loading'>('loading');
    const [error, setError] = useState<string | null>(null);
    const [streamingContent, setStreamingContent] = useState('');
    // Scroll State
    const [scrollY, setScrollY] = useState(0);
    const [contentHeight, setContentHeight] = useState(0);
    const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
    const contentRef = React.useRef<DOMElement>(null);
    // ink-mouse types require a non-null DOMElement ref
    const viewportRef = React.useRef<DOMElement>(null!);

    const { stdout } = useStdout();
    const width = stdout?.columns || 80;
    const height = stdout?.rows || 24;

    // Viewport height: leave room for header (2) and input/footer (4)
    const viewHeight = Math.max(5, height - 6);

    // Measure content height whenever it changes
    useEffect(() => {
        if (contentRef.current) {
            const { height: measuredHeight } = measureElement(contentRef.current);
            setContentHeight(measuredHeight);
        }
    }, [messages, streamingContent, status, width]);

    // Auto-scroll logic
    useEffect(() => {
        if (shouldAutoScroll) {
            setScrollY(Math.max(0, contentHeight - viewHeight));
        }
    }, [contentHeight, viewHeight, shouldAutoScroll]);

    const scrollBy = useCallback((delta: number) => {
        const maxScroll = Math.max(0, contentHeight - viewHeight);
        setScrollY((prev) => {
            const next = Math.max(0, Math.min(prev + delta, maxScroll));
            setShouldAutoScroll(next >= maxScroll);
            return next;
        });
    }, [contentHeight, viewHeight]);

    // Handle Input (keystrokes) and Scroll
    useInput((_inputData, key) => {
        if (key.pageUp) scrollBy(-viewHeight);
        if (key.pageDown) scrollBy(viewHeight);

        // Arrow keys support
        if (key.upArrow) scrollBy(-1);
        if (key.downArrow) scrollBy(1);
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

    const handleSubmit = async (value: string) => {
        if (!value.trim()) return;

        const userMessage: ChatMessage = { role: 'user', content: value };
        const historyWithUser = [...messages, userMessage];

        setMessages(historyWithUser);
        setInput('');
        setStatus('busy');
        setError(null);
        setShouldAutoScroll(true);

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
                {!shouldAutoScroll && <Text color="yellow"> (Scrolled UP)</Text>}
            </Box>

            {/* Content Viewport */}
            <Box ref={viewportRef} flexDirection="column" flexGrow={1} height={viewHeight} overflow="hidden">
                <MouseScrollManager viewportRef={viewportRef} onScrollBy={scrollBy} />
                <Box ref={contentRef} flexDirection="column" marginTop={-scrollY} flexShrink={0}>
                    {messages.map((msg, index) => (
                        <Box key={index} flexDirection="column" marginBottom={1} flexShrink={0}>
                            <Box flexShrink={0}>
                                <Text bold color={msg.role === 'user' ? 'green' : 'cyan'}>
                                    {msg.role === 'user' ? '[YOU]' : `[${providerName.toUpperCase()}]`}
                                </Text>
                            </Box>
                            <Box paddingLeft={2} flexShrink={0}>
                                <Markdown width={width - 6}>{msg.content}</Markdown>
                            </Box>
                        </Box>
                    ))}

                    {status === 'loading' && (
                        <Box flexShrink={0}>
                            <Thinking />
                            <Text> Resuming...</Text>
                        </Box>
                    )}

                    {status === 'busy' && (
                        <Box flexShrink={0}>
                            <Thinking />
                        </Box>
                    )}

                    {status === 'streaming' && streamingContent && (
                        <Box flexDirection="column" marginBottom={1} flexShrink={0}>
                            <Box flexShrink={0}>
                                <Text bold color="cyan">
                                    [{providerName.toUpperCase()}]
                                </Text>
                            </Box>
                            <Box paddingLeft={2} flexShrink={0}>
                                <Markdown width={width - 6}>{streamingContent}</Markdown>
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
