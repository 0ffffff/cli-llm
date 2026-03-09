import type { ProviderConfig, ModelConfig } from './providerData.js';
import { PROVIDERS, MODELS } from './providerData.js';

export function getProviders(): ProviderConfig[] {
    return PROVIDERS;
}

export function getProviderById(id: string): ProviderConfig | undefined {
    const normalized = id.trim().toLowerCase();
    return PROVIDERS.find(p => p.id === normalized);
}

export function getModelsForProvider(providerId: string): ModelConfig[] {
    const normalized = providerId.trim().toLowerCase();
    return MODELS.filter(m => m.providerId === normalized);
}

export function getModelLabel(providerId: string, modelId: string): string {
    const provider = getProviderById(providerId);
    const models = getModelsForProvider(providerId);
    const model = models.find(m => m.id === modelId);

    const providerDisplay = provider?.displayName ?? providerId;
    const labelText = model?.label ?? modelId;

    return `${providerDisplay} — ${labelText}`;
}

