import { AIProvider, AICapabilities, TTSRequest } from "../interfaces";
import { BrowserTTS } from "./BrowserTTS";

export class BrowserProvider extends AIProvider {
    readonly name = "Browser TTS (Local)";
    readonly description = "Uses built-in browser Web Speech API for text-to-speech";
    readonly capabilities: AICapabilities = {
        canGenerateText: false,
        canTextToSpeech: true,
        canSpeechToText: false,
    };

    private speechSynthesis: SpeechSynthesis;

    constructor() {
        super();
        if (typeof window === "undefined") {
            throw new Error("Browser provider can only be used in browser environment");
        }
        this.speechSynthesis = window.speechSynthesis;
    }

    validateConfig(): string {
        return "";
    }

    async textToSpeech(request: TTSRequest): Promise<BrowserTTS> {
        const utterance = new SpeechSynthesisUtterance(request.text);

        if (request.speed) utterance.rate = request.speed;
        if (request.pitch) utterance.pitch = request.pitch;
        if (request.language) utterance.lang = request.language;

        const voices = this.speechSynthesis.getVoices();
        if (request.voice) {
            const voice = voices.find((v) => v.name === request.voice);
            if (voice) utterance.voice = voice;
        } else {
            utterance.voice = voices.find((v) => v.lang === request.language);
        }

        return new BrowserTTS(utterance);
    }
}
