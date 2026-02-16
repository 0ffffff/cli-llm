import * as React from 'react';
import { useState, useEffect } from 'react';
import { Box, Text } from 'ink';
import TextInput from 'ink-text-input';
import { KimiClient } from '../api/kimi.js';
import { HistoryManager } from '../history/manager.js';
import { Markdown } from './components/Markdown.js';
import { Thinking } from './components/Thinking.js';
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

    // Load existing history if any
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

        try {
            const client = new KimiClient(config.apiKey!, config.model);
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
                // Update the last message (the assistant's being formed)
                setMessages([...historyWithUser, { role: 'assistant', content: assistantContent }]);
            }

            const finalMessages: ChatMessage[] = [...historyWithUser, { role: 'assistant', content: assistantContent }];
            await HistoryManager.saveSession(sessionId, finalMessages);
            await HistoryManager.cleanup(config.historyLimit);
            setStatus('idle');
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
            setStatus('error');
        }
    };

    return (
        <Box flexDirection="column" paddingX={1} paddingTop={1}>
            <Box marginBottom={1}>
                <Text color="blue" bold>● Kimi k2.5 Session</Text>
                <Text color="gray"> ({sessionId})</Text>
            </Box>

            <Box flexDirection="column">
                {messages.map((msg, index) => (
                    <Box key={index} flexDirection="column" marginBottom={1}>
                        <Text bold color={msg.role === 'user' ? 'green' : 'cyan'}>
                            {msg.role === 'user' ? 'YOU' : 'KIMI'}
                        </Text>
                        <Box paddingLeft={2}>
                            <Markdown>{msg.content}</Markdown>
                        </Box>
                    </Box>
                ))}
            </Box>

            {status === 'loading' && (
                <Box marginBottom={1}>
                    <Thinking />
                    <Text> Loading history...</Text>
                </Box>
            )}

            {status === 'busy' && (
                <Box marginBottom={1}>
                    <Thinking />
                </Box>
            )}

            {status === 'error' && (
                <Box marginBottom={1}>
                    <Text color="red">Error: {error}</Text>
                </Box>
            )}

            {(status === 'idle' || status === 'error') && (
                <Box>
                    <Text color="green">❯ </Text>
                    <TextInput value={input} onChange={setInput} onSubmit={handleSubmit} />
                </Box>
            )}
        </Box>
    );
};
