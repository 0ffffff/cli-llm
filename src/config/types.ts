export interface AppConfig {
    apiKey?: string;
    model: string;
    defaultSystemPrompt: string;
    historyPath: string;
}

export const DEFAULT_CONFIG: AppConfig = {
    model: "kimi-k2.5",
    defaultSystemPrompt: "You are a helpful academic assistant specialized in text completion and general purpose queries.",
    historyPath: "history", // Relative to config dir
};
