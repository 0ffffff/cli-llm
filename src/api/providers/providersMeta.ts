import { getProviders, getModelsForProvider } from './modelCatalog.js';

export interface ProviderMeta {
    id: string;
    displayName: string;
    defaultModels: Array<{
        id: string;
        label?: string;
    }>;
}

export const PROVIDERS: ProviderMeta[] = getProviders().map(provider => ({
    id: provider.id,
    displayName: provider.displayName,
    defaultModels: getModelsForProvider(provider.id).map(model => ({
        id: model.id,
        label: model.label,
    })),
}));

