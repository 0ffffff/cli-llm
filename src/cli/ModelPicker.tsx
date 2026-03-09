import * as React from 'react';
import { useMemo, useState } from 'react';
import { Box, Text, useApp } from 'ink';
import SelectInput from 'ink-select-input';
import type { AppConfig } from '../config/types.js';
import { getProviderDisplayName } from '../api/providers/registry.js';
import { getProviders, getModelsForProvider } from '../api/providers/modelCatalog.js';

interface ModelPickerProps {
    config: AppConfig;
    onSelect: (selection: { provider: string; model: string } | null) => void;
}

interface SelectItem {
    label: string;
    value: string;
}

export const ModelPicker: React.FC<ModelPickerProps> = ({ config, onSelect }) => {
    const { exit } = useApp();
    const [step, setStep] = useState<'provider' | 'model'>('provider');
    const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null);

    const providerItems: SelectItem[] = useMemo(() => {
        const providers = getProviders();
        return providers.map(provider => ({
            label: provider.displayName,
            value: provider.id,
        }));
    }, []);

    const modelItems: SelectItem[] = useMemo(() => {
        if (!selectedProviderId) {
            return [];
        }

        const normalizedProviderId = selectedProviderId.trim().toLowerCase();

        const catalogModels = getModelsForProvider(normalizedProviderId);

        const displayProvider = getProviderDisplayName(normalizedProviderId);

        return catalogModels.map(model => {
            const labelText = model.label ?? model.id;
            const label = `${displayProvider} — ${labelText}`;
            const value = JSON.stringify({
                provider: normalizedProviderId,
                model: model.id,
            });
            return { label, value };
        });
    }, [selectedProviderId]);

    const handleProviderSelect = (item: SelectItem) => {
        setSelectedProviderId(item.value);
        setStep('model');
    };

    const handleModelSelect = (item: SelectItem) => {
        try {
            const parsed = JSON.parse(item.value) as { provider: string; model: string };
            onSelect(parsed);
        } catch {
            onSelect(null);
        }
        exit();
    };

    if (step === 'provider') {
        if (providerItems.length === 0) {
            return (
                <Box padding={1}>
                    <Text color="red">No providers are configured.</Text>
                </Box>
            );
        }

        return (
            <Box flexDirection="column" padding={1}>
                <Box marginBottom={1}>
                    <Text bold color="blue">● Select a Provider</Text>
                </Box>
                <Box marginBottom={1}>
                    <Text color="gray">Use ↑/↓ to choose a provider, Enter to continue</Text>
                </Box>
                <SelectInput items={providerItems} onSelect={handleProviderSelect} />
            </Box>
        );
    }

    if (!selectedProviderId || modelItems.length === 0) {
        return (
            <Box padding={1}>
                <Text color="red">No models are configured for the selected provider.</Text>
            </Box>
        );
    }

    const providerDisplay = getProviderDisplayName(selectedProviderId);

    return (
        <Box flexDirection="column" padding={1}>
            <Box marginBottom={1}>
                <Text bold color="blue">● Select a Model — {providerDisplay}</Text>
            </Box>
            <Box marginBottom={1}>
                <Text color="gray">Use ↑/↓ to choose a model, Enter to select</Text>
            </Box>
            <SelectInput items={modelItems} onSelect={handleModelSelect} />
        </Box>
    );
};

