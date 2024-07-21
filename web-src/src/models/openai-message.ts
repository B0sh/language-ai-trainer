export type OpenAIMessageRole = 'system' | 'user' | 'assistant';
export interface OpenAIMessage {
    role: OpenAIMessageRole;
    content: string;
}
