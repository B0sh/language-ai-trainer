import { LLMRequest, LLMResult, TTSAudio } from "../../ai/interfaces";
import { PROMPT_COMP_SENTENCE, PROMPT_COMP_VALIDATE } from "../../ai/prompts/comp-prompts";
import { AIProviderRegistry } from "../../ai/registry";
import { TARGET_LANGUAGES } from "../../shared/languages";

interface ComprehensionCheckResponse {
    valid: boolean;
    explanation: string;
}

export class CompChallenge {
    private language: string;
    private ttsAudio: TTSAudio | null = null;

    public streak = 0;
    public status = "active";
    public storyText = "";
    public comprehensionResponse: ComprehensionCheckResponse | null = null;

    constructor(language: string) {
        this.language = language;
    }

    public setStatus(status: string): void {
        this.status = status;
    }

    private loading = false;
    public async generateProblem(): Promise<boolean> {
        if (this.loading) {
            return false;
        }

        this.loading = true;
        const language = TARGET_LANGUAGES.find((l) => l.id === this.language)?.description;

        try {
            const request = PROMPT_COMP_SENTENCE(language);
            const response = await AIProviderRegistry.llm(request);

            this.storyText = response.response;

            await this.generateAudio(this.storyText);
            this.loading = false;

            return true;
        } catch (error) {
            this.loading = false;
            throw new Error("Failed to generate comprehension story");
        }
    }

    public async checkComprehension(input: string): Promise<ComprehensionCheckResponse> {
        const language = TARGET_LANGUAGES.find((l) => l.id === this.language)?.description;
        if (!language) {
            throw new Error("Invalid language configuration");
        }

        let response: LLMResult | null = null;
        try {
            const request: LLMRequest = PROMPT_COMP_VALIDATE(language, this.storyText, input);
            response = await AIProviderRegistry.llm(request);
        } catch (error) {
            throw new Error(`Comprehension check failed: ${error.message}`);
        }

        if (response) {
            try {
                const parsedResponse = JSON.parse(response.response);
                if (typeof parsedResponse.valid !== "boolean" || typeof parsedResponse.explanation !== "string") {
                    throw new Error();
                }

                this.comprehensionResponse = parsedResponse;

                return parsedResponse;
            } catch (parseError) {
                throw new Error("Comprehension check failed: Unable to parse LLM response.");
            }
        }
    }

    public async generateAudio(text: string): Promise<void> {
        if (this.ttsAudio) {
            return this.ttsAudio.stop();
        }

        const ttsRequest = {
            text,
            language: this.language,
        };

        const result = await AIProviderRegistry.textToSpeech(ttsRequest);
        if (result) {
            this.ttsAudio = result;
        }
    }

    public async playAudio(): Promise<void> {
        if (this.ttsAudio) {
            await this.ttsAudio.stop();
            await this.ttsAudio.play();
        }
    }

    public async stopAudio(): Promise<void> {
        if (this.ttsAudio) {
            await this.ttsAudio.stop();
        }
    }

    public nextRound() {
        this.storyText = "";
        this.streak += 1;
        this.status = "active";
        this.ttsAudio = null;
    }
}
