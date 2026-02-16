import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import type { ChatMessage } from '../api/types.js';

export class HistoryManager {
    private static readonly CONFIG_DIR = path.join(os.homedir(), '.cli-llm');
    private static readonly HISTORY_DIR = path.join(this.CONFIG_DIR, 'history');

    static async saveSession(sessionId: string, messages: ChatMessage[]): Promise<void> {
        if (!fs.existsSync(this.HISTORY_DIR)) {
            fs.mkdirSync(this.HISTORY_DIR, { recursive: true });
        }

        const filePath = path.join(this.HISTORY_DIR, `${sessionId}.json`);
        try {
            fs.writeFileSync(filePath, JSON.stringify(messages, null, 2), 'utf-8');
            // Set permissions to 600 (read/write by owner only) for security
            fs.chmodSync(filePath, 0o600);
        } catch (error) {
            console.error(`Failed to save session ${sessionId}:`, error);
            throw error;
        }
    }

    static async loadSession(sessionId: string): Promise<ChatMessage[]> {
        const filePath = path.join(this.HISTORY_DIR, `${sessionId}.json`);

        if (!fs.existsSync(filePath)) {
            return [];
        }

        try {
            const data = fs.readFileSync(filePath, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.error(`Failed to load session ${sessionId}:`, error);
            return [];
        }
    }

    static async listSessions(): Promise<string[]> {
        if (!fs.existsSync(this.HISTORY_DIR)) {
            return [];
        }

        try {
            const files = fs.readdirSync(this.HISTORY_DIR);
            return files
                .filter(file => file.endsWith('.json'))
                .map(file => file.replace('.json', ''));
        } catch (error) {
            console.error('Failed to list sessions:', error);
            return [];
        }
    }

    /**
     * Internal helper to get the history directory path
     */
    static getHistoryDir(): string {
        return this.HISTORY_DIR;
    }
}
