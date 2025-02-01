import { DateChallengeRoundConfig } from "../ui/date-trainer/DateChallenge";
import { NumberChallengeRoundConfig } from "../ui/number-trainer/NumberChallenge";

export interface AppSettings {
    tts: string;
    stt: string;
    llm: string;
    appLanguage: string;
    targetLanguage: string;
    volume: number;
    theme: "light" | "dark" | "auto";
    numberTrainerDifficulty: string;
    numberTrainerGenSentence: boolean;
    numberTrainerCustomConfig: NumberChallengeRoundConfig | null;
    dateTrainerDifficulty: string;
    dateTrainerGenSentence: boolean;
    dateTrainerCustomConfig: DateChallengeRoundConfig | null;
    microphoneDeviceId: string | null;
    configs: Record<string, any>;
}

export const DEFAULT_SETTINGS: AppSettings = {
    tts: "browser",
    stt: "openai",
    llm: "openai",
    configs: {
        openai: { apiKey: "", organization: "" },
        google: { apiKey: "" },
        llama: { model: "" },
    },
    appLanguage: "en-US",
    targetLanguage: "en",
    theme: "auto",
    numberTrainerDifficulty: "easy",
    numberTrainerGenSentence: false,
    numberTrainerCustomConfig: null,
    dateTrainerDifficulty: "easy",
    dateTrainerGenSentence: false,
    dateTrainerCustomConfig: null,
    volume: 80,
    microphoneDeviceId: null,
};
