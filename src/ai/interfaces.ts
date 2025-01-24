/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
export interface TTSRequest {
    text: string;
    language: string;
    voice?: string;
    speed?: number;
    pitch?: number;
}

export interface SpeechToTextOptions {
    language?: string;
    continuous?: boolean;
    interimResults?: boolean;
}

export interface SpeechToTextResult {
    text: string;
    confidence: number;
    isFinal: boolean;
    metadata?: Record<string, any>;
}

export interface LLMGenerationOptions {
    temperature?: number;
    maxTokens?: number;
    stop?: string[];
    model?: string;
    systemPrompt?: string;
}

export interface LLMGenerationResult {
    text: string;
    tokens?: number;
    metadata?: Record<string, any>;
}

export interface AICapabilities {
    canGenerateText: boolean;
    canTextToSpeech: boolean;
    canSpeechToText: boolean;
}

export abstract class AIProvider {
    abstract readonly name: string;
    abstract readonly description: string;
    abstract readonly capabilities: AICapabilities;

    validateConfig(): string {
        throw new Error("Method not implemented");
    }

    textToSpeech?(request: TTSRequest): Promise<TTSAudio> {
        throw new Error("Text to speech not supported by this provider");
    }

    speechToText?(audioData: ArrayBuffer | MediaStream, options?: SpeechToTextOptions): Promise<SpeechToTextResult> {
        throw new Error("Speech to text not supported by this provider");
    }

    generateText?(prompt: string, options?: LLMGenerationOptions): Promise<LLMGenerationResult> {
        throw new Error("Text generation not supported by this provider");
    }

    configure?(config: Record<string, any>): void {
        // Optional configuration method
    }
}

export abstract class TTSAudio {
    text: string;
    abstract play(): Promise<void>;
    abstract stop(): Promise<void>;
    abstract pause(): Promise<void>;
    abstract resume(): Promise<void>;
}
