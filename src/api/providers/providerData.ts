export interface ProviderConfig {
    id: string;
    displayName: string;
    description?: string;
}

export interface ModelConfig {
    id: string;
    providerId: string;
    label?: string;
}

export const PROVIDERS: ProviderConfig[] = [
    {
        id: 'nim',
        displayName: 'NVIDIA NIM',
        description: 'Models served via NVIDIA NIM endpoints.',
    },
    {
        id: 'cerebras',
        displayName: 'Cerebras Cloud',
        description: 'Models served via the Cerebras Cloud API.',
    },
];

export const MODELS: ModelConfig[] = [
    // NVIDIA NIM models (include org prefix as required by the API)
    { id: 'stepfun-ai/step-3.5-flash', providerId: 'nim', label: 'STEP 3.5 Flash' },
    { id: 'moonshotai/kimi-k2.5', providerId: 'nim', label: 'Kimi K2.5' },
    {
        id: 'nvidia/llama-nemotron-embed-vl-1b-v2',
        providerId: 'nim',
        label: 'Llama Nemotron Embed VL 1B v2',
    },
    { id: 'z-ai/glm4.7', providerId: 'nim', label: 'GLM 4.7' },
    {
        id: 'mistralai/mistral-large-3-675b-instruct-2512',
        providerId: 'nim',
        label: 'Mistral Large 3 675B Instruct 2512',
    },
    // Cerebras Cloud models
    { id: 'gpt-oss-120b', providerId: 'cerebras', label: 'GPT-OSS 120B' },
];

