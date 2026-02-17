export interface ProviderInfo {
    name: string;        // Display name: "Kimi k2.5", "ChatGPT", "Claude", etc.
    baseUrl: string;     // API endpoint
    modelId: string;     // Model identifier for the API
}

export interface AppConfig {
    apiKey?: string;
    model: string;
    provider: string;      // Provider display name
    baseUrl: string;       // API base URL
    defaultSystemPrompt: string;
    historyLimit: number;
    historyPath: string;
}

import { DEFAULT_SYSTEM_PROMPT } from './SYSTEM_PROMPT.ts';

/**
 * Detect provider info from an API key prefix.
 */
export function detectProvider(apiKey: string): ProviderInfo {
    if (apiKey.startsWith('nvapi-')) {
        return {
            name: 'Kimi k2.5',
            baseUrl: 'https://integrate.api.nvidia.com/v1/chat/completions',
            modelId: 'moonshotai/kimi-k2.5',
        };
    }
    if (apiKey.startsWith('sk-ant-')) {
        return {
            name: 'Claude',
            baseUrl: 'https://api.anthropic.com/v1/messages',
            modelId: 'claude-sonnet-4-20250514',
        };
    }
    if (apiKey.startsWith('sk-')) {
        return {
            name: 'ChatGPT',
            baseUrl: 'https://api.openai.com/v1/chat/completions',
            modelId: 'gpt-4o',
        };
    }
    // Default: treat as OpenAI-compatible
    return {
        name: 'AI',
        baseUrl: 'https://api.openai.com/v1/chat/completions',
        modelId: 'gpt-4o',
    };
}

export const DEFAULT_CONFIG: AppConfig = {
    model: 'moonshotai/kimi-k2.5',
    provider: 'Kimi k2.5',
    baseUrl: 'https://integrate.api.nvidia.com/v1/chat/completions',
    defaultSystemPrompt: DEFAULT_SYSTEM_PROMPT,
    historyLimit: 50,
    historyPath: "history",
};
