import { TTSAudio, TTSRequest } from "../../ai/interfaces";
import { AIProviderRegistry } from "../../ai/registry";

export type NumberChallengeStatus = "active" | "correct" | "incorrect";

export class NumberChallenge {
    public currentNumber: number;
    public status: NumberChallengeStatus;
    public streak: number;
    private ttsAudio: TTSAudio | null;

    constructor() {
        this.currentNumber = generateNumber();
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
        this.currentNumber = generateNumber();
        this.status = "active";
        this.streak += 1;
    }

    public checkAnswer(answer: string): boolean {
        const parsedAnswer = parseInt(answer, 10);
        return !isNaN(parsedAnswer) && parsedAnswer === this.currentNumber;
    }
}

export const generateNumber = (): number => {
    return Math.floor(Math.random() * 1000) + 1;
};
