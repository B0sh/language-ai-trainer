import { AIProvider, TTSRequest } from "./interfaces";
import { BrowserProvider } from "./browser/BrowserProvider";
import { OpenAIProvider } from "./openai/OpenAIProvider";

export class AIProviderRegistry {
    private static providers = new Map<string, new (...args: any[]) => AIProvider>();
    private static activeProviders = new Map<string, AIProvider>();

    static registerDefaults() {
        this.registerProvider("browser", BrowserProvider);
        this.registerProvider("openai", OpenAIProvider);
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

    static async textToSpeech(request: TTSRequest) {
        const provider = this.getActiveProvider("tts");
        if (!provider.textToSpeech) {
            throw new Error(`Provider ${provider.name} does not support text-to-speech`);
        }
        return provider.textToSpeech(request);
    }

    static async speechToText(audioData: ArrayBuffer | MediaStream, options?: any) {
        const provider = this.getActiveProvider("stt");
        if (!provider.speechToText) {
            throw new Error(`Provider ${provider.name} does not support speech-to-text`);
        }
        return provider.speechToText(audioData, options);
    }

    static async generateText(prompt: string, options?: any) {
        const provider = this.getActiveProvider("llm");
        if (!provider.generateText) {
            throw new Error(`Provider ${provider.name} does not support text generation`);
        }
        return provider.generateText(prompt, options);
    }
}
AIProviderRegistry.registerDefaults();
