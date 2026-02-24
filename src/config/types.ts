import { DEFAULT_SYSTEM_PROMPT } from './SYSTEM_PROMPT.js';

export interface AppConfig {
    /**
     * Map of provider IDs to API keys, e.g. { nim: '...', cerebras: '...' }.
     */
    apiKeys?: Record<string, string>;
    model: string;
    /**
     * Provider ID used by the client factory (e.g. "nim", "cerebras").
     */
    provider: string;
    baseUrl: string;       // Chat completions endpoint URL
    defaultSystemPrompt: string;
    historyLimit: number;
    historyPath: string;
}

export const DEFAULT_CONFIG: AppConfig = {
    // These must be configured for your endpoint.
    // They can be provided via ~/.cli-llm/config.json or environment variables.
    model: 'default',
    provider: 'nim',
    baseUrl: '',
    defaultSystemPrompt: DEFAULT_SYSTEM_PROMPT,
    historyLimit: 50,
    historyPath: "history",
};
