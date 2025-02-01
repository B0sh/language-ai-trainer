import { TTSAudio, TTSRequest } from "../../ai/interfaces";
import { generateAIInspirationWord } from "../../ai/prompts/ai-inspiration-words";
import { PROMPT_NUMBER_TRAINER_SENTENCE } from "../../ai/prompts/number-trainer-prompts";
import { AIProviderRegistry } from "../../ai/registry";
import { getTargetLanguage } from "../../shared/languages";
import { getRandomInt } from "../../shared/utility";
import { Weighter } from "../../shared/weighter";

export interface NumberChallengeRoundConfig {
    label?: string;
    helpText?: string;
    generators: NumberChallengeRoundGenerator[];
}

export interface NumberChallengeRoundGenerator {
    type: "random";
    weight: number;
    min: number;
    max: number;
    multiplier?: number;
}

export type NumberChallengeStatus = "active" | "correct" | "incorrect";

export class NumberChallenge {
    public currentNumber: number;
    public status: NumberChallengeStatus;
    public text: string;
    public language: string;
    public sentenceMode: boolean;
    public inspirationWord: string;
    public config: NumberChallengeRoundConfig;
    private ttsAudio: TTSAudio | null;

    constructor(config: NumberChallengeRoundConfig, language: string, sentenceMode: boolean) {
        this.config = config;

        this.currentNumber = this.generateNumber();
        this.status = "active";
        this.ttsAudio = null;
        this.language = language;
        this.sentenceMode = sentenceMode;
    }

    loading = false;
    public async generateSentence(): Promise<void> {
        if (!this.sentenceMode) {
            this.text = this.currentNumber.toString();
        } else {
            this.loading = true;
            const language = getTargetLanguage(this.language);

            this.inspirationWord = generateAIInspirationWord();

            const prompt = PROMPT_NUMBER_TRAINER_SENTENCE(
                language?.description,
                this.currentNumber,
                this.inspirationWord
            );
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

    public setStatus(status: NumberChallengeStatus): void {
        this.status = status;
    }

    public nextRound(): void {
        this.currentNumber = this.generateNumber();
        this.status = "active";
    }

    public generateNumber(): number {
        const weighter = new Weighter<NumberChallengeRoundGenerator>();
        for (const generator of this.config.generators) {
            weighter.add(generator, generator.weight);
        }

        const round = weighter.getWeightedItem();
        switch (round.type) {
            case "random":
                return getRandomInt(round.min, round.max) * (round.multiplier ?? 1);
        }

        throw new Error("Invalid round type");
    }

    public checkAnswer(answer: string): boolean {
        const parsedAnswer = parseInt(answer, 10);
        return !isNaN(parsedAnswer) && parsedAnswer === this.currentNumber;
    }
}
