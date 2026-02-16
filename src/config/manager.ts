import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { type AppConfig, DEFAULT_CONFIG } from './types.js';

export class ConfigManager {
    private static readonly CONFIG_DIR = path.join(os.homedir(), '.cli-llm');
    private static readonly CONFIG_FILE = path.join(ConfigManager.CONFIG_DIR, 'config.json');

    static async load(): Promise<AppConfig> {
        if (!fs.existsSync(this.CONFIG_FILE)) {
            return { ...DEFAULT_CONFIG };
        }

        try {
            const data = fs.readFileSync(this.CONFIG_FILE, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Failed to load configuration:', error);
            return { ...DEFAULT_CONFIG };
        }
    }

    static async save(config: AppConfig): Promise<void> {
        if (!fs.existsSync(this.CONFIG_DIR)) {
            fs.mkdirSync(this.CONFIG_DIR, { recursive: true });
        }

        try {
            fs.writeFileSync(this.CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8');
            // Set permissions to 600 (read/write by owner only) for security
            fs.chmodSync(this.CONFIG_FILE, 0o600);
        } catch (error) {
            console.error('Failed to save configuration:', error);
            throw error;
        }
    }

    static getConfigPath(): string {
        return this.CONFIG_FILE;
    }
}
