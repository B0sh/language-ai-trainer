import { TTSAudio, TTSRequest } from "../../ai/interfaces";
import { generateAIInspirationWord } from "../../ai/prompts/ai-inspiration-words";
import { PROMPT_DATE_TRAINER_SENTENCE } from "../../ai/prompts/date-trainer-prompts";
import { AIProviderRegistry } from "../../ai/registry";
import { TARGET_LANGUAGES } from "../../shared/languages";
import { getRandomElement } from "../../shared/utility";
import { Weighter } from "../../shared/weighter";

export interface DateChallengeRound {
    answer: Date;
    sentence?: string;
    format: "yyyy-mm-dd" | "yyyy-mm" | "yyyy" | "mm-dd" | "yyyy-mm-dd hh:mm" | "hh:mm";
}

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
    public round: DateChallengeRound;
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
        this.round = this.generateRound();
        this.status = "active";
        this.streak = 0;
        this.ttsAudio = null;
        this.language = language;
        this.sentenceMode = sentenceMode;
    }

    loading = false;
    public async generateSentence(): Promise<void> {
        const formattedDate = this.convertDateToFormat(this.round.answer, this.round.format);

        if (!this.sentenceMode) {
            this.text = formattedDate;
        } else {
            this.loading = true;
            const language = TARGET_LANGUAGES.find((l) => l.id === this.language)?.description;

            this.inspirationWord = generateAIInspirationWord();

            const prompt = PROMPT_DATE_TRAINER_SENTENCE(language, formattedDate, this.inspirationWord);
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
        this.round = this.generateRound();
        this.status = "active";
        this.streak++;
    }

    private generateRound(): DateChallengeRound {
        return {
            answer: new Date(),
            format: getRandomElement(["yyyy", "yyyy-mm", "yyyy-mm-dd", "mm-dd", "yyyy-mm-dd hh:mm", "hh:mm"]),
        };

        // const weighter = new Weighter<DateChallengeRoundGenerator>();
        // this.config.generators.forEach((generator) => {
        //     weighter.add(generator, generator.weight);
        // });

        // const generator = weighter.getWeightedItem();
        // if (!generator) {
        //     throw new Error("No generators configured");
        // }

        // const year = Math.floor(Math.random() * (generator.maxYear - generator.minYear + 1)) + generator.minYear;
        // const month = Math.floor(Math.random() * 12);
        // const day = Math.floor(Math.random() * 28) + 1; // Using 28 to avoid invalid dates

        // return new Date(year, month, day);
    }

    public convertDateToFormat(date: Date, format: string): string {
        switch (format) {
            case "yyyy":
                return date.toLocaleDateString(this.language, { year: "numeric" });
            case "yyyy-mm":
                return date.toLocaleDateString(this.language, { year: "numeric", month: "long" });
            case "yyyy-mm-dd":
                return date.toLocaleDateString(this.language, { year: "numeric", month: "2-digit", day: "2-digit" });
            case "mm-dd":
                return date.toLocaleDateString(this.language, { month: "long", day: "2-digit" });
            case "yyyy-mm-dd hh:mm":
                return date.toLocaleDateString(this.language, {
                    year: "numeric",
                    month: "2-digit",
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
                break;
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
