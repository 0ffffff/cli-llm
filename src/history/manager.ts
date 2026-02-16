import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import type { ChatMessage } from '../api/types.js';

export interface SessionData {
    name: string;
    messages: ChatMessage[];
}

export interface SessionInfo {
    id: string;
    name: string;
    mtime: number;
}

export class HistoryManager {
    private static readonly CONFIG_DIR = path.join(os.homedir(), '.cli-llm');
    private static readonly HISTORY_DIR = path.join(this.CONFIG_DIR, 'history');

    /**
     * Save session with metadata wrapper (name + messages).
     */
    static async saveSession(sessionId: string, messages: ChatMessage[], name?: string): Promise<void> {
        if (!fs.existsSync(this.HISTORY_DIR)) {
            fs.mkdirSync(this.HISTORY_DIR, { recursive: true });
        }

        const filePath = path.join(this.HISTORY_DIR, `${sessionId}.json`);

        // If file already exists and no name provided, keep the old name
        let sessionName = name || '';
        if (!sessionName && fs.existsSync(filePath)) {
            try {
                const existing = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
                if (existing.name) {
                    sessionName = existing.name;
                }
            } catch { }
        }

        // Auto-generate name from first user message if still empty
        if (!sessionName && messages.length > 0) {
            const firstUserMsg = messages.find(m => m.role === 'user');
            if (firstUserMsg) {
                sessionName = firstUserMsg.content.slice(0, 60).replace(/\n/g, ' ').trim();
                if (firstUserMsg.content.length > 60) sessionName += '…';
            }
        }

        const data: SessionData = { name: sessionName, messages };

        try {
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
            fs.chmodSync(filePath, 0o600);
        } catch (error) {
            console.error(`Failed to save session ${sessionId}:`, error);
            throw error;
        }
    }

    /**
     * Load messages from a session file. Handles both old (array) and new (object) formats.
     */
    static async loadSession(sessionId: string): Promise<ChatMessage[]> {
        const filePath = path.join(this.HISTORY_DIR, `${sessionId}.json`);

        if (!fs.existsSync(filePath)) {
            return [];
        }

        try {
            const raw = fs.readFileSync(filePath, 'utf-8');
            const data = JSON.parse(raw);

            // Handle old format (plain array)
            if (Array.isArray(data)) {
                return data;
            }

            // New format (SessionData)
            return data.messages || [];
        } catch (error) {
            console.error(`Failed to load session ${sessionId}:`, error);
            return [];
        }
    }

    /**
     * List sessions with metadata (name, mtime) for display.
     */
    static async listSessionsDetailed(): Promise<SessionInfo[]> {
        if (!fs.existsSync(this.HISTORY_DIR)) {
            return [];
        }

        try {
            const files = fs.readdirSync(this.HISTORY_DIR)
                .filter(file => file.endsWith('.json'));

            const sessions: SessionInfo[] = [];

            for (const file of files) {
                const filePath = path.join(this.HISTORY_DIR, file);
                const stats = fs.statSync(filePath);
                const id = file.replace('.json', '');

                let name = id;
                try {
                    const raw = fs.readFileSync(filePath, 'utf-8');
                    const data = JSON.parse(raw);
                    if (data.name) {
                        name = data.name;
                    }
                } catch { }

                sessions.push({ id, name, mtime: stats.mtimeMs });
            }

            // Sort by mtime descending (newest first)
            sessions.sort((a, b) => b.mtime - a.mtime);

            return sessions;
        } catch (error) {
            console.error('Failed to list sessions:', error);
            return [];
        }
    }

    /**
     * Simple list of session IDs (for backward compatibility).
     */
    static async listSessions(): Promise<string[]> {
        const detailed = await this.listSessionsDetailed();
        return detailed.map(s => s.id);
    }

    /**
     * Remove oldest sessions if limit exceeded.
     */
    static async cleanup(limit: number): Promise<void> {
        if (!fs.existsSync(this.HISTORY_DIR)) return;

        try {
            const files = fs.readdirSync(this.HISTORY_DIR)
                .filter(file => file.endsWith('.json'))
                .map(file => {
                    const filePath = path.join(this.HISTORY_DIR, file);
                    const stats = fs.statSync(filePath);
                    return { name: file, path: filePath, mtime: stats.mtimeMs };
                });

            if (files.length <= limit) return;

            files.sort((a, b) => a.mtime - b.mtime);

            const toDelete = files.slice(0, files.length - limit);
            for (const file of toDelete) {
                fs.unlinkSync(file.path);
            }
        } catch (error) {
            console.error('Failed to cleanup history:', error);
        }
    }

    /**
     * Delete ALL session history files.
     */
    static async deleteAll(): Promise<void> {
        if (!fs.existsSync(this.HISTORY_DIR)) return;

        try {
            const files = fs.readdirSync(this.HISTORY_DIR)
                .filter(file => file.endsWith('.json'));

            for (const file of files) {
                fs.unlinkSync(path.join(this.HISTORY_DIR, file));
            }
        } catch (error) {
            console.error('Failed to delete history:', error);
        }
    }

    static getHistoryDir(): string {
        return this.HISTORY_DIR;
    }
}
