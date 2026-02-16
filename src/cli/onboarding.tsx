import React, { useState } from 'react';
import { Box, Text, useApp } from 'ink';
import TextInput from 'ink-text-input';
import chalk from 'chalk';
import { ConfigManager } from '../config/manager.js';

export const Onboarding: React.FC = () => {
    const [key, setKey] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { exit } = useApp();

    const handleSubmit = async (value: string) => {
        const config = await ConfigManager.load();
        await ConfigManager.save({
            ...config,
            apiKey: value,
        });
        setIsSubmitted(true);
        // Small delay to show success before exiting
        setTimeout(() => {
            exit();
        }, 1000);
    };

    return (
        <Box flexDirection="column" padding={1} borderStyle="round" borderColor="blue">
            <Text bold color="blue">
                Welcome to cli-llm!
            </Text>
            <Text marginTop={1}>
                To get started, you need to provide your {chalk.yellow('NVIDIA Cloud API Key')}.
            </Text>
            <Text color="gray" marginBottom={1}>
                (Your key is stored locally in ~/.cli-llm/config.json)
            </Text>

            {!isSubmitted ? (
                <Box>
                    <Text color="green">API Key: </Text>
                    <TextInput value={key} onChange={setKey} onSubmit={handleSubmit} mask="*" />
                </Box>
            ) : (
                <Text color="green">✔ API Key saved successfully! Restarting...</Text>
            )}
        </Box>
    );
};
