import { AICapabilities, AIProvider, LLMRequest, LLMResult, TTSRequest } from "../interfaces";
import { GoogleTTSAudio } from "./GoogleTTSAudio";
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as VOICE_LIST from "./google-voices.json";
import { getRandomElement } from "../../shared/utility";

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

    validateConfig(): string {
        if (!this.apiKey) {
            return "Google API key not configured";
        }

        return "";
    }

    async textToSpeech(request: TTSRequest): Promise<GoogleTTSAudio> {
        const config = this.validateConfig();
        if (config) {
            throw new Error(config);
        }

        const availableVoices = VOICE_LIST.voices.filter((v) => v.languageCodes.includes(request.language));

        if (availableVoices.length === 0) {
            throw new Error(`No google voice found for language ${request.language}`);
        }

        let voice = "";
        if (request.voice) {
            if (request.voice === "default") {
                voice = availableVoices[0].name;
            } else if (request.voice === "random") {
                voice = getRandomElement(availableVoices).name;
            } else {
                voice = availableVoices.find((v) => v.name === request.voice)?.name;
            }
        }

        if (!voice) {
            voice = availableVoices[0].name;
        }

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
        return new GoogleTTSAudio(request.text, data.audioContent);
    }

    async generateText(request: LLMRequest): Promise<LLMResult> {
        const validation = this.validateConfig();
        if (validation) {
            throw new Error(validation);
        }

        if (!this.genAI) {
            throw new Error("Gemini API not initialized");
        }

        const model = "gemini-1.0";

        try {
            const genModel = this.genAI.getGenerativeModel({ model });
            const result = await genModel.generateContent(request.prompt);
            const response = await result.response;
            const text = response.text();

            return {
                response: text,
                metadata: {
                    model,
                },
            };
        } catch (error) {
            throw new Error(`Gemini API error: ${error.message}`);
        }
    }
}
