export interface AppSettings {
    tts: string;
    stt: string;
    llm: string;
    appLanguage: string;
    targetLanguage: string;
    theme: string;
    configs: Record<string, any>;
}

export const DEFAULT_SETTINGS: AppSettings = {
    tts: "browser",
    stt: "openai",
    llm: "openai",
    configs: {
        openai: { apiKey: "", organization: "" },
    },
    appLanguage: "en-US",
    targetLanguage: "en",
    theme: "light",
};
