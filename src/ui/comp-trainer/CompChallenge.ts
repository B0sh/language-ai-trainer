import { LLMRequest, LLMResult, TTSAudio } from "../../ai/interfaces";
import { generateAIInspirationWord } from "../../ai/prompts/ai-inspiration-words";
import { PROMPT_COMP_SENTENCE, PROMPT_COMP_VALIDATE } from "../../ai/prompts/comp-prompts";
import { AIProviderRegistry } from "../../ai/registry";
import { TargetLanguageLevel } from "../../models/app-settings";
import { getTargetLanguage } from "../../shared/languages";

interface ComprehensionCheckResponse {
    valid: boolean;
    explanation: string;
}

export class CompChallenge {
    private language: string;
    private languageLevel: TargetLanguageLevel;

    public ttsAudio: TTSAudio | null = null;
    public status = "active";
    public storyText = "";
    public inspirationWord = "";
    public comprehensionResponse: ComprehensionCheckResponse | null = null;

    constructor(language: string, languageLevel: TargetLanguageLevel) {
        this.language = language;
        this.languageLevel = languageLevel;
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
        const language = getTargetLanguage(this.language);

        this.inspirationWord = generateAIInspirationWord(this.language, this.languageLevel);

        const prompt = PROMPT_COMP_SENTENCE(language?.description, this.languageLevel, this.inspirationWord);
        const response = await AIProviderRegistry.llm(prompt);

        this.storyText = response.response;
        this.loading = false;

        return true;
    }

    public async generateProblemAudio(): Promise<boolean> {
        if (this.loading) {
            return false;
        }

        if (this.ttsAudio) {
            this.ttsAudio.stop();
            return false;
        }

        const ttsRequest = {
            text: this.storyText,
            language: this.language,
        };

        this.loading = true;
        const result = await AIProviderRegistry.textToSpeech(ttsRequest);
        this.loading = false;

        if (result) {
            this.ttsAudio = result;
        } else {
            throw new Error("Failed to generate audio");
        }

        return true;
    }

    public async checkComprehension(input: string): Promise<ComprehensionCheckResponse> {
        const language = getTargetLanguage(this.language);
        if (!language) {
            throw new Error("Invalid language configuration");
        }

        let response: LLMResult | null = null;
        try {
            const request: LLMRequest = PROMPT_COMP_VALIDATE(language.description, this.storyText, input);
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

    public async playAudio(volume: number): Promise<void> {
        if (this.ttsAudio) {
            await this.ttsAudio.stop();
            await this.ttsAudio.play(volume);
        }
    }

    public async stopAudio(): Promise<void> {
        if (this.ttsAudio) {
            await this.ttsAudio.stop();
        }
    }

    public nextRound() {
        this.storyText = "";
        this.status = "active";
        this.ttsAudio = null;
    }
}
