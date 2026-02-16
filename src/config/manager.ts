import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { type AppConfig, DEFAULT_CONFIG, detectProvider } from './types.js';

export class ConfigManager {
    private static readonly CONFIG_DIR = path.join(os.homedir(), '.cli-llm');
    private static readonly CONFIG_FILE = path.join(ConfigManager.CONFIG_DIR, 'config.json');

    static async load(): Promise<AppConfig> {
        let config: AppConfig = { ...DEFAULT_CONFIG };

        // Try to load from file first
        if (fs.existsSync(this.CONFIG_FILE)) {
            try {
                const data = fs.readFileSync(this.CONFIG_FILE, 'utf-8');
                const parsed = JSON.parse(data);
                config = { ...DEFAULT_CONFIG, ...parsed };
            } catch (error) {
                console.error('Failed to load configuration:', error);
            }
        }

        // Environment variables override file config
        const envKey = process.env.LLM_API_KEY || process.env.NVIDIA_API_KEY;
        if (envKey) {
            config.apiKey = envKey.trim();
        }

        // If we have an API key, auto-detect provider settings
        if (config.apiKey && (!config.provider || config.provider === DEFAULT_CONFIG.provider)) {
            config.apiKey = config.apiKey.trim();
            const provider = detectProvider(config.apiKey);
            config.provider = provider.name;
            config.baseUrl = provider.baseUrl;
            config.model = provider.modelId;
        }

        return config;
    }

    static async save(config: AppConfig): Promise<void> {
        if (!fs.existsSync(this.CONFIG_DIR)) {
            fs.mkdirSync(this.CONFIG_DIR, { recursive: true });
        }

        try {
            fs.writeFileSync(this.CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8');
            fs.chmodSync(this.CONFIG_FILE, 0o600);
        } catch (error) {
            console.error('Failed to save configuration:', error);
            throw error;
        }
    }

    static getConfigPath(): string {
        return this.CONFIG_FILE;
    }

    static getConfigDir(): string {
        return this.CONFIG_DIR;
    }
}
