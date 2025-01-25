import { AIProvider, LLMRequest, TTSAudio, TTSRequest } from "./interfaces";
import { BrowserProvider } from "./browser/BrowserProvider";
import { OpenAIProvider } from "./openai/OpenAIProvider";
import { GoogleProvider } from "./google/GoogleProvider";
import { LlamaProvider } from "./llama/LlamaProvider";

export class AIProviderRegistry {
    private static providers = new Map<string, new (...args: any[]) => AIProvider>();
    private static activeProviders = new Map<string, AIProvider>();
    private static sttProcessing = false;
    private static llmProcessing = false;
    private static ttsProcessing = false;

    static registerDefaults() {
        this.registerProvider("browser", BrowserProvider);
        this.registerProvider("openai", OpenAIProvider);
        this.registerProvider("google", GoogleProvider);
        this.registerProvider("llama", LlamaProvider);
    }

    static registerProvider(id: string, providerClass: new (...args: any[]) => AIProvider) {
        this.providers.set(id, providerClass);
    }

    static getProviderClass(id: string): new (...args: any[]) => AIProvider {
        const provider = this.providers.get(id);
        if (!provider) {
            throw new Error(`Provider ${id} not found`);
        }
        return provider;
    }

    static getAvailableProviders(): Array<{ id: string; name: string; description: string; capabilities: any }> {
        return Array.from(this.providers.entries()).map(([id, Provider]) => {
            const instance = new Provider();
            return {
                id,
                name: instance.name,
                description: instance.description,
                capabilities: instance.capabilities,
            };
        });
    }

    static setActiveProvider(type: "tts" | "stt" | "llm", provider: AIProvider) {
        if (type === "tts" && !provider.capabilities.canTextToSpeech) {
            throw new Error(`Provider ${provider.name} does not support text-to-speech`);
        }
        if (type === "stt" && !provider.capabilities.canSpeechToText) {
            throw new Error(`Provider ${provider.name} does not support speech-to-text`);
        }
        if (type === "llm" && !provider.capabilities.canGenerateText) {
            throw new Error(`Provider ${provider.name} does not support text generation`);
        }
        this.activeProviders.set(type, provider);
    }

    static getActiveProvider(type: "tts" | "stt" | "llm"): AIProvider {
        const provider = this.activeProviders.get(type);
        if (!provider) {
            throw new Error(`No active provider set for ${type}`);
        }
        return provider;
    }

    static async textToSpeech(request: TTSRequest): Promise<TTSAudio | undefined> {
        const provider = this.getActiveProvider("tts");
        if (!provider.textToSpeech) {
            throw new Error(`Provider ${provider.name} does not support text-to-speech`);
        }
        if (this.ttsProcessing) {
            return;
        }

        this.ttsProcessing = true;
        return provider
            .textToSpeech(request)
            .then((tts) => {
                this.ttsProcessing = false;
                return tts;
            })
            .catch((error) => {
                this.ttsProcessing = false;
                throw error;
            });
    }

    static async speechToText(audioData: ArrayBuffer | MediaStream, options?: any) {
        const provider = this.getActiveProvider("stt");
        if (!provider.speechToText) {
            throw new Error(`Provider ${provider.name} does not support speech-to-text`);
        }
        if (this.sttProcessing) {
            return;
        }
        this.sttProcessing = true;
        return provider
            .speechToText(audioData, options)
            .then((stt) => {
                this.sttProcessing = false;
                return stt;
            })
            .catch((error) => {
                this.sttProcessing = false;
                throw error;
            });
    }

    static async llm(request: LLMRequest) {
        const provider = this.getActiveProvider("llm");
        if (!provider.llm) {
            throw new Error(`Provider ${provider.name} does not support text generation`);
        }
        if (this.llmProcessing) {
            return;
        }
        this.llmProcessing = true;
        return provider
            .llm(request)
            .then((llm) => {
                this.llmProcessing = false;
                return llm;
            })
            .catch((error) => {
                this.llmProcessing = false;
                throw error;
            });
    }
}
AIProviderRegistry.registerDefaults();
