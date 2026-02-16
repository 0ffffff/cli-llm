import type { ChatCompletionChunk, ChatCompletionRequest, ChatCompletionResponse, ChatMessage } from './types.js';

export class KimiClient {
    private static readonly BASE_URL = 'https://integrate.api.nvidia.com/v1/chat/completions';

    constructor(
        private readonly apiKey: string,
        private readonly model: string = 'moonshotai/kimi-k2.5'
    ) { }

    async sendMessage(messages: ChatMessage[], options: Partial<ChatCompletionRequest> = {}): Promise<string> {
        const request: ChatCompletionRequest = {
            model: this.model,
            messages,
            stream: false,
            ...options,
        };

        const response = await fetch(KimiClient.BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`,
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
            ...options,
        };

        const response = await fetch(KimiClient.BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`,
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
                        const data = JSON.parse(trimmed.slice(6)) as ChatCompletionChunk;
                        const content = data.choices[0]?.delta.content;
                        if (content) {
                            yield content;
                        }
                    } catch (e) {
                        // Partial JSON or other error, ignore and continue
                    }
                }
            }
        }
    }
}
