import { NumberChallengeRoundConfig } from "../ui/number-trainer/NumberChallenge";

export interface AppSettings {
    tts: string;
    stt: string;
    llm: string;
    appLanguage: string;
    targetLanguage: string;
    volume: number;
    theme: string;
    numberTrainerDifficulty: string;
    numberTrainerGenSentence: boolean;
    numberTrainerCustomConfig: NumberChallengeRoundConfig | null;
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
    theme: "light",
    numberTrainerDifficulty: "easy",
    numberTrainerGenSentence: false,
    numberTrainerCustomConfig: null,
    volume: 50,
    microphoneDeviceId: null,
};
