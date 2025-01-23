import { AICapabilities, AIProvider, LLMGenerationOptions, LLMGenerationResult, TTSRequest } from "../interfaces";
import { GoogleTTSAudio } from "./GoogleTTSAudio";
import { GoogleGenerativeAI } from "@google/generative-ai";

interface GoogleConfig {
    apiKey: string;
}

export class GoogleProvider extends AIProvider {
    readonly name = "Google";
    readonly description = "Google's AI services including Text-to-Speech and Gemini";
    readonly capabilities: AICapabilities = {
        canGenerateText: true,
        canTextToSpeech: true,
        canSpeechToText: false,
    };

    private apiKey?: string;
    private genAI?: GoogleGenerativeAI;

    constructor(config?: GoogleConfig) {
        super();
        if (config) {
            this.configure(config);
        }
    }

    configure(config: GoogleConfig): void {
        this.apiKey = config.apiKey;
        if (this.apiKey) {
            this.genAI = new GoogleGenerativeAI(this.apiKey);
        }
    }

    private validateConfig() {
        if (!this.apiKey) {
            throw new Error("Google API key not configured");
        }
    }

    async textToSpeech(request: TTSRequest): Promise<GoogleTTSAudio> {
        this.validateConfig();

        if (!request.voice) {
            request.voice = "ja-JP-Neural2-B";
        }

        // const voice = this.weightedRandom([
        //     { value: "ja-JP-Neural2-B", weight: 10 },
        //     { value: "ja-JP-Neural2-C", weight: 10 },
        //     { value: "ja-JP-Neural2-D", weight: 10 },
        //     { value: "ja-JP-Wavenet-A", weight: 10 },
        //     { value: "ja-JP-Wavenet-B", weight: 10 },
        //     { value: "ja-JP-Wavenet-C", weight: 10 },
        //     { value: "ja-JP-Wavenet-D", weight: 10000 },
        // ]);

        const dto = {
            audioConfig: {
                audioEncoding: "MP3",
                effectsProfileId: ["headphone-class-device"],
                pitch: request.pitch ?? 0,
                speakingRate: request.speed ?? 1,
            },
            input: { text: request.text },
            voice: {
                languageCode: request.language,
                name: request.voice,
            },
        };

        const response = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${this.apiKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dto),
        });

        if (!response.ok) {
            throw new Error(`Google TTS API error: ${response.statusText}`);
        }

        const data = await response.json();
        return new GoogleTTSAudio(data.audioContent);
    }

    async generateText(prompt: string, options: LLMGenerationOptions = {}): Promise<LLMGenerationResult> {
        this.validateConfig();

        if (!this.genAI) {
            throw new Error("Gemini API not initialized");
        }

        try {
            const model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            return {
                text,
                metadata: {
                    model: "gemini-pro",
                },
            };
        } catch (error) {
            throw new Error(`Gemini API error: ${error.message}`);
        }
    }
}
