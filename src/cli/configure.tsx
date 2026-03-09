import * as React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { Box, Text, useApp } from 'ink';
import chalk from 'chalk';
import { ConfigManager } from '../config/manager.js';
import { ChatInput } from './components/ChatInput.js';

type Step = 'apiKey' | 'baseUrl' | 'model' | 'done';

export const Configure: React.FC<{ missing?: Array<'apiKey' | 'baseUrl'> }> = ({ missing = [] }) => {
    const { exit } = useApp();

    const configPath = useMemo(() => ConfigManager.getConfigPath(), []);

    const [step, setStep] = useState<Step>('apiKey');
    const [apiKey, setApiKey] = useState('');
    const [baseUrl, setBaseUrl] = useState('');
    const [model, setModel] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        // If only baseUrl is missing, skip straight to that step
        if (missing.length === 1 && missing[0] === 'baseUrl') {
            setStep('baseUrl');
        }
    }, [missing]);

    const validateBaseUrl = (value: string): string | null => {
        if (!value.trim()) return 'Endpoint URL is required.';
        try {
            const u = new URL(value.trim());
            if (!u.protocol.startsWith('http')) return 'Endpoint URL must start with http:// or https://';
        } catch {
            return 'Endpoint URL must be a valid URL.';
        }
        return null;
    };

    const saveConfig = async (finalApiKey: string, finalBaseUrl: string, finalModel: string) => {
        setIsSaving(true);
        setError(null);

        const existing = await ConfigManager.load();
        const trimmedKey = finalApiKey.trim();
        const existingAny = existing as any;
        const apiKeys = {
            ...(existingAny.apiKeys ?? {}),
            nim: trimmedKey,
        } as Record<string, string>;

        await ConfigManager.save({
            ...existing,
            apiKeys,
            baseUrl: finalBaseUrl.trim(),
            model: (finalModel.trim() || 'default'),
            // Default to the canonical provider ID for new configs.
            provider: existing.provider?.trim() ? existing.provider : 'nim',
        });

        setIsSaving(false);
        setIsSaved(true);
        setStep('done');
        setTimeout(() => exit(), 1200);
    };

    const handleSubmit = async (value: string) => {
        setError(null);

        if (step === 'apiKey') {
            const trimmed = value.trim();
            if (!trimmed) {
                setError('API key is required.');
                return;
            }
            setApiKey(trimmed);
            setStep('baseUrl');
            return;
        }

        if (step === 'baseUrl') {
            const next = value.trim();
            const err = validateBaseUrl(next);
            if (err) {
                setError(err);
                return;
            }
            setBaseUrl(next);
            setStep('model');
            return;
        }

        if (step === 'model') {
            setModel(value);
            await saveConfig(apiKey, baseUrl, value);
        }
    };

    const title = missing.length > 0
        ? `Missing configuration: ${missing.join(', ')}`
        : 'Configuration';

    return (
        <Box flexDirection="column" padding={1} borderStyle="round" borderColor="blue">
            <Box marginBottom={1}>
                <Text bold color="blue">{title}</Text>
            </Box>

            <Box flexDirection="column" marginBottom={1}>
                <Text>
                    This CLI is endpoint/model-agnostic. Provide the credentials and endpoint for your AI service.
                </Text>
                <Text color="gray">
                    Saved to {chalk.bold(configPath)} (you can edit it manually later).
                </Text>
            </Box>

            {error && (
                <Box marginBottom={1}>
                    <Text color="red">Error: {error}</Text>
                </Box>
            )}

            {!isSaved ? (
                <Box flexDirection="column">
                    {step === 'apiKey' && (
                        <Box>
                            <Text color="green">API Key: </Text>
                            <ChatInput
                                value={apiKey}
                                onChange={setApiKey}
                                onSubmit={handleSubmit}
                                mask="*"
                            />
                        </Box>
                    )}

                    {step === 'baseUrl' && (
                        <Box>
                            <Text color="green">Endpoint URL: </Text>
                            <ChatInput
                                value={baseUrl}
                                onChange={setBaseUrl}
                                onSubmit={handleSubmit}
                                placeholder="https://…/v1/chat/completions"
                            />
                        </Box>
                    )}

                    {step === 'model' && (
                        <Box flexDirection="column">
                            <Box>
                                <Text color="green">Model: </Text>
                                <ChatInput
                                    value={model}
                                    onChange={setModel}
                                    onSubmit={handleSubmit}
                                    placeholder="default"
                                    focus
                                />
                            </Box>
                            <Box marginTop={1}>
                                <Text color="gray">
                                    You can also set {chalk.bold('LLM_API_KEY')}, {chalk.bold('LLM_BASE_URL')}, {chalk.bold('LLM_MODEL')}.
                                </Text>
                            </Box>
                        </Box>
                    )}

                    {isSaving && (
                        <Box marginTop={1}>
                            <Text color="gray">Saving…</Text>
                        </Box>
                    )}
                </Box>
            ) : (
                <Box flexDirection="column">
                    <Text color="green">✔ Configuration saved.</Text>
                    <Text color="gray">  Re-run `llm` to start chatting.</Text>
                </Box>
            )}
        </Box>
    );
};

