import { DEFAULT_SYSTEM_PROMPT } from './SYSTEM_PROMPT.js';

export interface AppConfig {
    apiKey?: string;
    model: string;
    provider: string;      // Display name shown in the UI (e.g. "AI")
    baseUrl: string;       // Chat completions endpoint URL
    defaultSystemPrompt: string;
    historyLimit: number;
    historyPath: string;
}

export const DEFAULT_CONFIG: AppConfig = {
    // These must be configured for your endpoint.
    // They can be provided via ~/.cli-llm/config.json or environment variables.
    model: 'default',
    provider: 'AI',
    baseUrl: '',
    defaultSystemPrompt: DEFAULT_SYSTEM_PROMPT,
    historyLimit: 50,
    historyPath: "history",
};
