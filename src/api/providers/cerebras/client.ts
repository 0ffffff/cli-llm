import Cerebras from '@cerebras/cerebras_cloud_sdk';
import type { ChatMessage } from '../../types.js';
import type { LLMClient, LLMClientOptions } from '../../llm.js';

export class CerebrasLLMClient implements LLMClient {
    private readonly cerebras: Cerebras;
    private readonly model: string;

    constructor(apiKey: string, model: string) {
        this.cerebras = new Cerebras({
            apiKey,
        });
        this.model = model;
    }

    async sendMessage(messages: ChatMessage[], options?: LLMClientOptions): Promise<string> {
        let full = '';
        for await (const chunk of this.sendMessageStream(messages, options)) {
            full += chunk;
        }
        return full;
    }

    async *sendMessageStream(messages: ChatMessage[], options?: LLMClientOptions): AsyncIterable<string> {
        const stream = await this.cerebras.chat.completions.create({
            messages,
            model: this.model,
            stream: true,
            max_completion_tokens: options?.max_tokens ?? 32768,
            temperature: options?.temperature ?? 1,
            top_p: options?.top_p ?? 1,
            reasoning_effort: 'medium',
        });

        for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content;
            if (text) {
                yield text;
            }
        }
    }
}

