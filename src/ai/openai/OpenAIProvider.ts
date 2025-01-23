import {
    AIProvider,
    LLMGenerationOptions,
    LLMGenerationResult,
    SpeechToTextResult,
    AICapabilities,
} from "../interfaces";

export interface OpenAIConfig {
    apiKey: string;
    organization?: string;
}

export class OpenAIProvider extends AIProvider {
    readonly name = "OpenAI";
    readonly description = "OpenAI's suite of AI models including GPT-4, Whisper, and TTS";
    readonly capabilities: AICapabilities = {
        canGenerateText: true,
        canTextToSpeech: true,
        canSpeechToText: true,
    };

    private apiKey?: string;
    private organization?: string;

    constructor(config?: OpenAIConfig) {
        super();
        if (config) {
            this.configure(config);
        }
    }

    configure(config: OpenAIConfig): void {
        this.apiKey = config.apiKey;
        this.organization = config.organization;
    }

    validateConfig(): string {
        if (!this.apiKey) {
            return "OpenAI API key is not configured";
        }

        return "";
    }

    async generateText(prompt: string, options: LLMGenerationOptions = {}): Promise<LLMGenerationResult> {
        const validation = this.validateConfig();
        if (validation) {
            throw new Error(validation);
        }

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${this.apiKey}`,
                "Content-Type": "application/json",
                ...(this.organization && { "OpenAI-Organization": this.organization }),
            },
            body: JSON.stringify({
                model: options.model || "gpt-4",
                messages: [
                    ...(options.systemPrompt ? [{ role: "system", content: options.systemPrompt }] : []),
                    { role: "user", content: prompt },
                ],
                temperature: options.temperature ?? 0.7,
                max_tokens: options.maxTokens,
                stop: options.stop,
            }),
        });

        if (!response.ok) {
            throw new Error(`OpenAI API error: ${response.statusText}`);
        }

        const data = await response.json();
        return {
            text: data.choices[0].message.content,
            tokens: data.usage.total_tokens,
            metadata: {
                model: data.model,
                usage: data.usage,
            },
        };
    }

    // async textToSpeech(text: string, options: TextToSpeechOptions = {}): Promise<TextToSpeechResult> {
    // const validation = this.validateConfig();
    // if (validation) {
    //     throw new Error(validation);

    //     const response = await fetch('https://api.openai.com/v1/audio/speech', {
    //         method: 'POST',
    //         headers: {
    //             'Authorization': `Bearer ${this.apiKey}`,
    //             'Content-Type': 'application/json',
    //             ...(this.organization && { 'OpenAI-Organization': this.organization })
    //         },
    //         body: JSON.stringify({
    //             model: 'tts-1',
    //             input: text,
    //             voice: options.voice || 'alloy',
    //             speed: options.speed || 1.0
    //         })
    //     });

    //     if (!response.ok) {
    //         throw new Error(`OpenAI API error: ${response.statusText}`);
    //     }

    //     const audioBuffer = await response.arrayBuffer();
    //     return {
    //         audioBuffer,
    //         duration: 0, // OpenAI doesn't provide duration information
    //         metadata: {
    //             voice: options.voice || 'alloy',
    //             speed: options.speed || 1.0
    //         }
    //     };
    // }

    async speechToText(audioData: ArrayBuffer): Promise<SpeechToTextResult> {
        const validation = this.validateConfig();
        if (validation) {
            throw new Error(validation);
        }

        const formData = new FormData();
        const audioBlob = new Blob([audioData], { type: "audio/wav" });
        formData.append("file", audioBlob, "audio.wav");
        formData.append("model", "whisper-1");

        const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${this.apiKey}`,
                ...(this.organization && { "OpenAI-Organization": this.organization }),
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`OpenAI API error: ${response.statusText}`);
        }

        const data = await response.json();
        return {
            text: data.text,
            confidence: 1, // OpenAI doesn't provide confidence scores
            isFinal: true,
            metadata: {
                model: "whisper-1",
            },
        };
    }
}
