import * as React from 'react';
import { useEffect, useState } from 'react';
import { Box, Text, useApp, useInput } from 'ink';
import { ChatClient } from '../api/client.js';
import { Markdown } from './components/Markdown.js';
import { Thinking } from './components/Thinking.js';
import type { AppConfig } from '../config/types.js';

interface OneOffProps {
    prompt: string;
    config: AppConfig;
}

export const OneOff: React.FC<OneOffProps> = ({ prompt, config }) => {
    const [response, setResponse] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isStreaming, setIsStreaming] = useState(false);
    const { exit } = useApp();

    useEffect(() => {
        const client = new ChatClient(config.apiKey!, config.model, config.baseUrl);
        let assistantContent = '';

        const run = async () => {
            try {
                const stream = client.sendMessageStream([
                    { role: 'system', content: config.defaultSystemPrompt },
                    { role: 'user', content: prompt }
                ]);

                for await (const chunk of stream) {
                    setIsStreaming(true);
                    assistantContent += chunk;
                    setResponse(assistantContent);
                }
                setIsStreaming(false);
            } catch (err) {
                setError(err instanceof Error ? err.message : String(err));
            }
        };

        run();
    }, [prompt, config]);

    useEffect(() => {
        if ((response && !isStreaming) || error) {
            const timer = setTimeout(() => exit(), 500);
            return () => clearTimeout(timer);
        }
    }, [response, error, exit, isStreaming]);

    return (
        <Box flexDirection="column" paddingX={0} paddingTop={0}>
            {!response && !error && (
                <Thinking />
            )}

            {response && (
                <Markdown>{response}</Markdown>
            )}

            {error && (
                <Text color="red">Error: {error}</Text>
            )}
        </Box>
    );
};
