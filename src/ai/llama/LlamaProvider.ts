import { AIProvider, AICapabilities, LLMRequest, LLMResult } from "../interfaces";
import { LlamaListModelsResponse } from "./LlamaModel";
// https://github.com/ollama/ollama-js/issues/151
// must be manually imported from dist file because of upstream issue with ollama bundling
import ollama, { ChatRequest, ChatResponse, Message } from "ollama/dist/browser.cjs";

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

        const messages: Message[] = [];
        if (request.systemPrompt) {
            messages.push({ role: "system", content: request.systemPrompt });
        }
        messages.push({ role: "user", content: request.prompt });

        // Sad typescript assertion
        const dto: ChatRequest & { stream?: false } = {
            model: this.model,
            messages,
            stream: false,
            options: {
                temperature: request.temperature ?? 0.7,
            },
            format: request.format ?? undefined,
        };

        const response: ChatResponse = await ollama.chat(dto);

        return {
            response: response.message.content,
            tokens: response.eval_count,
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
