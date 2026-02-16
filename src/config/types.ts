export interface AppConfig {
    apiKey?: string;
    model: string;
    defaultSystemPrompt: string;
    historyLimit: number;
    historyPath: string;
}

export const DEFAULT_CONFIG: AppConfig = {
    model: 'moonshotai/kimi-k2.5',
    defaultSystemPrompt: 'You are Kimi, a helpful AI assistant. You provide concise and accurate answers.',
    historyLimit: 50,
    historyPath: "history", // Relative to config dir
};
