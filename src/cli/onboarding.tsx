import * as React from 'react';
import { useState } from 'react';
import { Box, Text, useApp } from 'ink';
import chalk from 'chalk';
import { ConfigManager } from '../config/manager.js';
import { detectProvider } from '../config/types.js';
import { ChatInput } from './components/ChatInput.js';

export const Onboarding: React.FC = () => {
    const [key, setKey] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [providerName, setProviderName] = useState('');
    const { exit } = useApp();

    const handleSubmit = async (value: string) => {
        const trimmed = value.trim();
        const provider = detectProvider(trimmed);
        const config = await ConfigManager.load();
        await ConfigManager.save({
            ...config,
            apiKey: trimmed,
            provider: provider.name,
            baseUrl: provider.baseUrl,
            model: provider.modelId,
        });
        setProviderName(provider.name);
        setIsSubmitted(true);
        setTimeout(() => {
            exit();
        }, 1500);
    };

    return (
        <Box flexDirection="column" padding={1} borderStyle="round" borderColor="blue">
            <Box marginBottom={1}>
                <Text bold color="blue">
                    Welcome to cli-llm!
                </Text>
            </Box>

            <Box>
                <Text>
                    To get started, provide your API key.
                </Text>
            </Box>
            <Box marginBottom={1}>
                <Text color="gray">
                    Supported: {chalk.yellow('NVIDIA (Kimi)')}, {chalk.green('OpenAI')}, {chalk.magenta('Anthropic')}
                </Text>
            </Box>

            <Box marginBottom={1}>
                <Text color="gray">
                    (Your key is stored locally in ~/.cli-llm/config.json)
                </Text>
            </Box>

            {!isSubmitted ? (
                <Box>
                    <Text color="green">API Key: </Text>
                    <ChatInput
                        value={key}
                        onChange={setKey}
                        onSubmit={handleSubmit}
                        mask="*"
                    />
                </Box>
            ) : (
                <Box flexDirection="column">
                    <Text color="green">✔ API Key saved successfully!</Text>
                    <Text color="cyan">  Provider detected: {chalk.bold(providerName)}</Text>
                    <Text color="gray">  Run `llm` again to start chatting.</Text>
                </Box>
            )}
        </Box>
    );
};
