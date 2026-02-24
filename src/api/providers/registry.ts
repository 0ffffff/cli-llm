import { PROVIDERS } from './providersMeta.js';

export function getProviderDisplayName(id: string): string {
    const normalized = id.trim().toLowerCase();
    const found = PROVIDERS.find(p => p.id === normalized);
    return found?.displayName ?? id;
}

export function getModelDisplayLabel(
    providerId: string,
    modelId: string,
): string {
    const normalizedProvider = providerId.trim().toLowerCase();

    const providerMeta = PROVIDERS.find(p => p.id === normalizedProvider);
    const fromDefaults = providerMeta?.defaultModels.find(m => m.id === modelId);

    const providerDisplay = getProviderDisplayName(normalizedProvider);
    const labelText = fromDefaults?.label ?? modelId;

    return `${providerDisplay} — ${labelText}`;
}

export function getDefaultModelOptions(): Array<{ id: string; provider: string; label?: string }> {
    const options: Array<{ id: string; provider: string; label?: string }> = [];
    for (const provider of PROVIDERS) {
        for (const model of provider.defaultModels) {
            options.push({
                id: model.id,
                provider: provider.id,
                label: model.label,
            });
        }
    }
    return options;
}

