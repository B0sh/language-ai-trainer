import { TTSAudio, TTSRequest } from "../../ai/interfaces";
import { generateAIInspirationWord } from "../../ai/prompts/ai-inspiration-words";
import { PROMPT_DATE_TRAINER_SENTENCE } from "../../ai/prompts/date-trainer-prompts";
import { AIProviderRegistry } from "../../ai/registry";
import { getTargetLanguage } from "../../shared/languages";
import { Weighter } from "../../shared/weighter";

export type DateChallengeRoundFormat =
    | "yyyy-mm-dd"
    | "yyyy-mm"
    | "yyyy"
    | "mm"
    | "mm-dd"
    | "yyyy-mm-dd hh:mm"
    | "hh:mm";

export interface DateChallengeRound {
    answer: Date;
    sentence?: string;
    format: DateChallengeRoundFormat;
}

export interface DateChallengeRoundConfig {
    label?: string;
    helpText?: string;
    generators: DateChallengeRoundGenerator[];
}

export interface DateChallengeRoundGenerator {
    format: DateChallengeRoundFormat;
    weight: number;
    min: Date;
    max: Date;
}

export type DateChallengeStatus = "active" | "correct" | "incorrect";

function getRandomDate(start: Date, end: Date): Date {
    const startTime = start.getTime();
    const endTime = end.getTime();
    const randomTime = Math.random() * (endTime - startTime) + startTime;
    return new Date(randomTime);
}

export class DateChallenge {
    public round: DateChallengeRound;
    public status: DateChallengeStatus;
    public language: string;
    public sentenceMode: boolean;
    public inspirationWord: string;
    public config: DateChallengeRoundConfig;
    private ttsAudio: TTSAudio | null;

    constructor(config: DateChallengeRoundConfig, language: string, sentenceMode: boolean) {
        this.config = config;
        this.round = this.generateRound();
        this.status = "active";
        this.ttsAudio = null;
        this.language = language;
        this.sentenceMode = sentenceMode;
    }

    loading = false;
    public async generateSentence(): Promise<void> {
        const formattedDate = this.convertDateToFormat(this.round.answer, this.round.format);

        if (!this.sentenceMode) {
            this.round.sentence = formattedDate;
        } else {
            this.loading = true;
            const language = getTargetLanguage(this.language);

            this.inspirationWord = generateAIInspirationWord();

            const prompt = PROMPT_DATE_TRAINER_SENTENCE(language?.description, formattedDate, this.inspirationWord);
            const result = await AIProviderRegistry.llm(prompt);

            this.loading = false;

            this.round.sentence = result.response;
        }
    }

    public async generateAudio(): Promise<void> {
        if (this.ttsAudio) {
            await this.ttsAudio.stop();
            this.ttsAudio = null;
        }

        const ttsRequest: TTSRequest = {
            text: this.round.sentence,
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

    public setStatus(status: DateChallengeStatus): void {
        this.status = status;
    }

    public nextRound(): void {
        this.round = this.generateRound();
        this.status = "active";
    }

    private generateRound(): DateChallengeRound {
        const weighter = new Weighter<DateChallengeRoundGenerator>();
        this.config.generators.forEach((generator) => {
            weighter.add(generator, generator.weight);
        });

        const generator = weighter.getWeightedItem();
        if (!generator) {
            throw new Error("No generators configured");
        }

        const date = getRandomDate(generator.min, generator.max);

        return {
            answer: date,
            sentence: undefined,
            format: generator.format,
        };
    }

    public convertDateToFormat(date: Date, format: string): string {
        switch (format) {
            case "yyyy":
                return date.toLocaleDateString(this.language, { year: "numeric" });
            case "yyyy-mm":
                return date.toLocaleDateString(this.language, { year: "numeric", month: "long" });
            case "yyyy-mm-dd":
                return date.toLocaleDateString(this.language, { year: "numeric", month: "long", day: "2-digit" });
            case "mm":
                return date.toLocaleDateString(this.language, { month: "long" });
            case "mm-dd":
                return date.toLocaleDateString(this.language, { month: "long", day: "2-digit" });
            case "yyyy-mm-dd hh:mm":
                return date.toLocaleDateString(this.language, {
                    year: "numeric",
                    month: "long",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                });
            case "hh:mm":
                return date.toLocaleTimeString(this.language, { hour: "2-digit", minute: "2-digit" });
        }
    }

    public displayAnswer(): string {
        return this.convertDateToFormat(this.round.answer, this.round.format);
    }

    public checkAnswer(userInput: string): boolean {
        let split: string[];
        switch (this.round.format) {
            case "yyyy":
                return this.round.answer.getFullYear() === parseInt(userInput);
            case "yyyy-mm":
                split = userInput.split("-");
                return (
                    this.round.answer.getFullYear() === parseInt(split[0]) &&
                    this.round.answer.getMonth() === parseInt(split[1]) - 1
                );
            case "yyyy-mm-dd":
                return (
                    this.round.answer.getFullYear() === parseInt(userInput.slice(0, 4)) &&
                    this.round.answer.getMonth() === parseInt(userInput.slice(5, 7)) - 1 &&
                    this.round.answer.getDate() === parseInt(userInput.slice(8, 10))
                );
            case "yyyy-mm-dd hh:mm":
                return (
                    this.round.answer.getFullYear() === parseInt(userInput.slice(0, 4)) &&
                    this.round.answer.getMonth() === parseInt(userInput.slice(5, 7)) - 1 &&
                    this.round.answer.getDate() === parseInt(userInput.slice(8, 10)) &&
                    this.round.answer.getHours() === parseInt(userInput.slice(11, 13)) &&
                    this.round.answer.getMinutes() === parseInt(userInput.slice(14, 16))
                );
            case "mm":
                return this.round.answer.getMonth() === parseInt(userInput) - 1;
            case "mm-dd":
                split = userInput.split("-");
                return (
                    this.round.answer.getMonth() === parseInt(split[0]) - 1 &&
                    this.round.answer.getDate() === parseInt(split[1])
                );
            case "hh:mm":
                return (
                    this.round.answer.getHours() === parseInt(userInput.slice(0, 2)) &&
                    this.round.answer.getMinutes() === parseInt(userInput.slice(3, 5))
                );
        }
    }
}
