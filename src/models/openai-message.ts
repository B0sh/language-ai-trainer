export type OpenAIMessageRole = "system" | "user" | "assistant";
export interface OpenAIMessage {
    role: OpenAIMessageRole;
    content: string;
}

export interface CorrectionMessage {
    role: OpenAIMessageRole;
    suggestedTextText?: string;
    notes?: string;
    content: string;

    // local properties
    showCorrection?: boolean;
}
