import type { AppConfig } from '../config/types.js';
import type { LLMClient } from './llm.js';
import { NimLLMClient } from './providers/nim/client.js';
import { CerebrasLLMClient } from './providers/cerebras/client.js';

function normalizeProvider(provider: string | undefined): string {
    const value = (provider || 'nim').trim().toLowerCase();
    if (!value || value === 'ai') {
        // Backwards compatibility: old configs used "AI" as a display-only provider name.
        return 'nim';
    }
    return value;
}

function resolveApiKey(config: AppConfig, provider: string): string {
    const map = config.apiKeys;
    const fromMap = map?.[provider];
    if (fromMap && fromMap.trim()) {
        return fromMap.trim();
    }
    throw new Error(`Missing API key for provider "${provider}". Please configure it first.`);
}

export function createLLMClient(config: AppConfig): LLMClient {
    const provider = normalizeProvider(config.provider);
    const apiKey = resolveApiKey(config, provider);
    const model = config.model;

    switch (provider) {
        case 'nim': {
            const endpoint = config.baseUrl;
            return new NimLLMClient(apiKey, model, endpoint);
        }
        case 'cerebras': {
            return new CerebrasLLMClient(apiKey, model);
        }
        default:
            throw new Error(`Unsupported provider: ${config.provider}`);
    }
}

