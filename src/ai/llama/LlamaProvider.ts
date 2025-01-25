import { AIProvider, AICapabilities, LLMRequest, LLMResult } from "../interfaces";
import { LlamaApiGenerateDto, LlamaApiGenerateResponse, LlamaListModelsResponse } from "./LlamaModel";

interface LlamaConfig {
    model: string;
}

export class LlamaProvider extends AIProvider {
    readonly name = "Llama (Local)";
    readonly description = "Locally installed Llama model";
    readonly capabilities: AICapabilities = {
        canGenerateText: true,
        canTextToSpeech: false,
        canSpeechToText: false,
    };

    private model: string;

    constructor(config?: LlamaConfig) {
        super();
        if (config) {
            this.configure(config);
        }
    }

    configure(config: LlamaConfig): void {
        this.model = config.model;
    }

    validateConfig(): string {
        if (!this.model) {
            return "Llama model is not configured";
        }

        return "";
    }

    async llm(request: LLMRequest): Promise<LLMResult> {
        const validation = this.validateConfig();
        if (validation) {
            throw new Error(validation);
        }

        const dto: LlamaApiGenerateDto = {
            prompt: request.prompt,
            model: this.model,
            stream: false,
            options: {
                temperature: request.temperature ?? 0.7,
            },
        };

        const response = await fetch("http://localhost:11434/api/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(dto),
        });

        if (!response.ok) {
            throw new Error(`Ollama API error: ${response.statusText}`);
        }

        const data: LlamaApiGenerateResponse = await response.json();

        return {
            response: data.response,
            tokens: data.eval_count,
        };
    }

    static async listModels(): Promise<LlamaListModelsResponse> {
        const response = await fetch("http://localhost:11434/api/tags", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Ollama API error: ${response.statusText}`);
        }

        const data: LlamaListModelsResponse = await response.json();
        return data;
    }
}
