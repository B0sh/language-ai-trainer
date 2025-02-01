import { TTSAudio, TTSRequest } from "../../ai/interfaces";
import { generateAIInspirationWord } from "../../ai/prompts/ai-inspiration-words";
import { PROMPT_DATE_TRAINER_SENTENCE } from "../../ai/prompts/date-trainer-prompts";
import { AIProviderRegistry } from "../../ai/registry";
import { TARGET_LANGUAGES } from "../../shared/languages";
import { Weighter } from "../../shared/weighter";

export interface DateChallengeRoundConfig {
    label?: string;
    helpText?: string;
    generators: DateChallengeRoundGenerator[];
}

export interface DateChallengeRoundGenerator {
    type: "random";
    weight: number;
    minYear: number;
    maxYear: number;
}

export type DateChallengeStatus = "active" | "correct" | "incorrect";

export class DateChallenge {
    public currentDate: Date;
    public status: DateChallengeStatus;
    public streak: number;
    public text: string;
    public language: string;
    public sentenceMode: boolean;
    public inspirationWord: string;
    public config: DateChallengeRoundConfig;
    private ttsAudio: TTSAudio | null;

    constructor(config: DateChallengeRoundConfig, language: string, sentenceMode: boolean) {
        this.config = config;
        this.currentDate = this.generateDate();
        this.status = "active";
        this.streak = 0;
        this.ttsAudio = null;
        this.language = language;
        this.sentenceMode = sentenceMode;
    }

    loading = false;
    public async generateSentence(): Promise<void> {
        if (!this.sentenceMode) {
            this.text = this.currentDate.toLocaleDateString(this.language);
        } else {
            this.loading = true;
            const language = TARGET_LANGUAGES.find((l) => l.id === this.language)?.description;

            this.inspirationWord = generateAIInspirationWord();

            const prompt = PROMPT_DATE_TRAINER_SENTENCE(language, this.currentDate, this.inspirationWord);
            const result = await AIProviderRegistry.llm(prompt);

            this.loading = false;

            this.text = result.response;
        }
    }

    public async generateAudio(): Promise<void> {
        if (this.ttsAudio) {
            await this.ttsAudio.stop();
            this.ttsAudio = null;
        }

        const ttsRequest: TTSRequest = {
            text: this.text,
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

    public setStatus(status: DateChallengeStatus): void {
        this.status = status;
    }

    public nextRound(): void {
        this.currentDate = this.generateDate();
        this.status = "active";
        this.streak++;
    }

    private generateDate(): Date {
        const weighter = new Weighter<DateChallengeRoundGenerator>();
        this.config.generators.forEach((generator) => {
            weighter.add(generator, generator.weight);
        });

        const generator = weighter.getWeightedItem();
        if (!generator) {
            throw new Error("No generators configured");
        }

        const year = Math.floor(Math.random() * (generator.maxYear - generator.minYear + 1)) + generator.minYear;
        const month = Math.floor(Math.random() * 12);
        const day = Math.floor(Math.random() * 28) + 1; // Using 28 to avoid invalid dates

        return new Date(year, month, day);
    }

    public checkAnswer(answer: string): boolean {
        const userDate = new Date(answer);
        return (
            userDate.getFullYear() === this.currentDate.getFullYear() &&
            userDate.getMonth() === this.currentDate.getMonth() &&
            userDate.getDate() === this.currentDate.getDate()
        );
    }
}
