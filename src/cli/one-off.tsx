import * as React from 'react';
import { useEffect, useState } from 'react';
import { Box, Text, useApp } from 'ink';
import { KimiClient } from '../api/kimi.js';
import type { AppConfig } from '../config/types.js';

interface OneOffProps {
    prompt: string;
    config: AppConfig;
}

export const OneOff: React.FC<OneOffProps> = ({ prompt, config }) => {
    const [response, setResponse] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const { exit } = useApp();

    useEffect(() => {
        const client = new KimiClient(config.apiKey!, config.model);

        client.sendMessage([
            { role: 'system', content: config.defaultSystemPrompt },
            { role: 'user', content: prompt }
        ])
            .then(res => {
                setResponse(res);
                // Process remains open for human to read, but SPEC says "post-completion exit"
                // Actually index.tsx will likely handle unmounting or we exit here.
                // For one-off, we just want to print and go.
            })
            .catch(err => {
                setError(err instanceof Error ? err.message : String(err));
            });
    }, [prompt, config]);

    useEffect(() => {
        if (response || error) {
            // Small delay or just exit? SPEC says "After a response is printed to the terminal, all history... deleted"
            // One-off usually exits immediately after output.
            // But in React/Ink, we might want to wait a beat or let the parent handle it.
            // For now, index.tsx will render this and we'll just show the result.
            // We will exit from here to ensure the process ends.
            if (response || error) {
                // Wait 100ms for final render
                setTimeout(() => exit(), 100);
            }
        }
    }, [response, error, exit]);

    return (
        <Box flexDirection="column" paddingX={1}>
            {!response && !error && (
                <Box>
                    <Text color="yellow">Thinking...</Text>
                </Box>
            )}

            {response && (
                <Box marginTop={1}>
                    <Text>{response}</Text>
                </Box>
            )}

            {error && (
                <Box marginTop={1}>
                    <Text color="red">Error: {error}</Text>
                </Box>
            )}
        </Box>
    );
};
