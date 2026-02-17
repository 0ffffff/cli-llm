import type { ChatCompletionChunk, ChatCompletionRequest, ChatCompletionResponse, ChatMessage } from './types.js';

/**
 * Generic client for a "chat completions" style HTTP endpoint that supports:
 * - JSON requests with { model, messages, stream }
 * - Streaming responses via server-sent events (lines starting with `data: ...`)
 */
export class ChatClient {
    private static readonly TIMEOUT_MS = 60000;

    constructor(
        private readonly apiKey: string,
        private readonly model: string,
        private readonly endpoint: string
    ) { }

    private async fetchWithTimeout(url: string, init: RequestInit): Promise<Response> {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), ChatClient.TIMEOUT_MS);

        try {
            const response = await fetch(url, {
                ...init,
                signal: controller.signal
            });
            clearTimeout(id);
            return response;
        } catch (error) {
            clearTimeout(id);
            if (error instanceof Error && error.name === 'AbortError') {
                throw new Error(`API Request timed out after ${ChatClient.TIMEOUT_MS / 1000}s.`);
            }
            throw error;
        }
    }

    async sendMessage(messages: ChatMessage[], options: Partial<ChatCompletionRequest> = {}): Promise<string> {
        const request: ChatCompletionRequest = {
            model: this.model,
            messages,
            stream: false,
            temperature: 1.0,
            top_p: 1.0,
            max_tokens: 4096,
            ...options,
        };

        const response = await this.fetchWithTimeout(this.endpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`API Error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
        }

        const data = (await response.json()) as ChatCompletionResponse;
        const content = data.choices[0]?.message.content;

        if (content === undefined) {
            throw new Error('Invalid response format: No content returned');
        }

        return content;
    }

    async *sendMessageStream(messages: ChatMessage[], options: Partial<ChatCompletionRequest> = {}): AsyncIterableIterator<string> {
        const request: ChatCompletionRequest = {
            model: this.model,
            messages,
            stream: true,
            temperature: 1.0,
            top_p: 1.0,
            max_tokens: 4096,
            ...options,
        };

        const response = await this.fetchWithTimeout(this.endpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`API Error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
        }

        if (!response.body) {
            throw new Error('Response body is null');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
                const trimmed = line.trim();
                if (!trimmed || trimmed === 'data: [DONE]') continue;

                if (trimmed.startsWith('data: ')) {
                    try {
                        const jsonStr = trimmed.slice(6);
                        const data = JSON.parse(jsonStr) as ChatCompletionChunk;
                        const content = data.choices[0]?.delta.content;
                        if (content) {
                            yield content;
                        }
                    } catch {
                        // ignore parsing errors for partial chunks
                    }
                }
            }
        }
    }
}

