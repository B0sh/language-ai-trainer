import { TTSAudio, TTSRequest } from "../../ai/interfaces";
import { AIProviderRegistry } from "../../ai/registry";
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
    public streak: number;
    public config: NumberChallengeRoundConfig;
    private ttsAudio: TTSAudio | null;

    constructor(config: NumberChallengeRoundConfig) {
        this.config = config;

        this.currentNumber = this.generateNumber();
        this.status = "active";
        this.streak = 0;
        this.ttsAudio = null;
    }

    public async generateAudio(language: string): Promise<void> {
        if (this.ttsAudio) {
            await this.ttsAudio.stop();
            this.ttsAudio = null;
        }

        const ttsRequest: TTSRequest = {
            text: this.currentNumber.toString(),
            language: language,
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

    public setStatus(status: NumberChallengeStatus): void {
        this.status = status;
    }

    public nextRound(): void {
        this.currentNumber = this.generateNumber();
        this.status = "active";
        this.streak += 1;
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
