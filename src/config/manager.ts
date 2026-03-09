import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { type AppConfig, DEFAULT_CONFIG } from './types.js';

export class ConfigManager {
    private static readonly CONFIG_DIR = path.join(os.homedir(), '.cli-llm');
    private static readonly CONFIG_FILE = path.join(ConfigManager.CONFIG_DIR, 'config.json');

    private static ensureConfigDirExists(): void {
        if (!fs.existsSync(this.CONFIG_DIR)) {
            fs.mkdirSync(this.CONFIG_DIR, { recursive: true });
        }
    }

    private static writeConfigSync(config: AppConfig): void {
        this.ensureConfigDirExists();
        // Omit legacy apiKey so config.json only stores apiKeys
        const { apiKey: _omit, ...rest } = config as AppConfig & { apiKey?: string };
        fs.writeFileSync(this.CONFIG_FILE, JSON.stringify(rest, null, 2), 'utf-8');
        fs.chmodSync(this.CONFIG_FILE, 0o600);
    }

    static async load(): Promise<AppConfig> {
        let config: AppConfig = { ...DEFAULT_CONFIG };

        // Try to load from file first
        if (fs.existsSync(this.CONFIG_FILE)) {
            try {
                const data = fs.readFileSync(this.CONFIG_FILE, 'utf-8');
                const parsed = JSON.parse(data);

                if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
                    throw new Error('Configuration file is not a valid object');
                }

                config = { ...DEFAULT_CONFIG, ...parsed };
            } catch (error) {
                console.error('Failed to load configuration:', error);

                // If the configuration file is malformed, restore a functioning version
                try {
                    this.writeConfigSync(DEFAULT_CONFIG);
                    console.error('Configuration file was malformed and has been reset to defaults.');
                    config = { ...DEFAULT_CONFIG };
                } catch (repairError) {
                    console.error('Additionally failed to repair configuration file:', repairError);
                }
            }
        }

        // Environment variables override file config
        const envKey = process.env.LLM_API_KEY;
        if (envKey) {
            const provider = (config.provider || 'nim').trim().toLowerCase();
            config.apiKeys = config.apiKeys ?? {};
            config.apiKeys[provider] = envKey.trim();
        }

        const envBaseUrl = process.env.LLM_BASE_URL;
        if (envBaseUrl) {
            config.baseUrl = envBaseUrl.trim();
        }

        const envModel = process.env.LLM_MODEL;
        if (envModel) {
            config.model = envModel.trim();
        }

        const envProviderName = process.env.LLM_PROVIDER_NAME;
        if (envProviderName) {
            config.provider = envProviderName.trim();
        }

        return config;
    }

    static async save(config: AppConfig): Promise<void> {
        try {
            this.writeConfigSync(config);
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
