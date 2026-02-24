import type { ChatMessage } from './types.js';

export interface LLMClientOptions {
    temperature?: number;
    top_p?: number;
    max_tokens?: number;
}

export interface LLMClient {
    sendMessage(messages: ChatMessage[], options?: LLMClientOptions): Promise<string>;
    sendMessageStream(messages: ChatMessage[], options?: LLMClientOptions): AsyncIterable<string>;
}

