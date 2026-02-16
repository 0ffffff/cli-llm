import * as React from 'react';
import { useEffect, useState } from 'react';
import { Box, Text, useApp } from 'ink';
import { KimiClient } from '../api/kimi.js';
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
    const { exit } = useApp();

    useEffect(() => {
        const client = new KimiClient(config.apiKey!, config.model);

        client.sendMessage([
            { role: 'system', content: config.defaultSystemPrompt },
            { role: 'user', content: prompt }
        ])
            .then(res => {
                setResponse(res);
            })
            .catch(err => {
                setError(err instanceof Error ? err.message : String(err));
            });
    }, [prompt, config]);

    useEffect(() => {
        if (response || error) {
            // Small delay for clean render before exit
            const timer = setTimeout(() => exit(), 500);
            return () => clearTimeout(timer);
        }
    }, [response, error, exit]);

    return (
        <Box flexDirection="column" paddingX={1} paddingTop={1}>
            {!response && !error && (
                <Thinking />
            )}

            {response && (
                <Box marginTop={1} flexDirection="column">
                    <Markdown>{response}</Markdown>
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
