import { AIProvider, LLMGenerationOptions, LLMGenerationResult, AICapabilities } from "../interfaces";
import { LlamaListModelsResponse } from "./LlamaModel";

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

    async generateText(prompt: string, options: LLMGenerationOptions = {}): Promise<LLMGenerationResult> {
        const validation = this.validateConfig();
        if (validation) {
            throw new Error(validation);
        }

        const response = await fetch("http://localhost:11434/api/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: this.model,
                prompt,
                stream: false,
                options: {
                    temperature: options.temperature ?? 0.7,
                    num_predict: options.maxTokens,
                    stop: options.stop,
                    ...(options.systemPrompt && { system: options.systemPrompt }),
                },
            }),
        });

        if (!response.ok) {
            throw new Error(`Ollama API error: ${response.statusText}`);
        }

        const data = await response.json();
        return {
            text: data.response,
            tokens: data.eval_count,
            metadata: {
                model: data.model,
                usage: {
                    total_duration: data.total_duration,
                    load_duration: data.load_duration,
                    prompt_eval_count: data.prompt_eval_count,
                    prompt_eval_duration: data.prompt_eval_duration,
                    eval_count: data.eval_count,
                    eval_duration: data.eval_duration,
                },
            },
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
