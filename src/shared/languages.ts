export type TargetLanguage = {
    id: string;
    description: string;
    ttsPreview: string;
};

export const TARGET_LANGUAGES: TargetLanguage[] = [
    {
        id: "en-US",
        description: "English",
        ttsPreview: "I'm inside of Walden's AI Language Trainer.",
    },
    {
        id: "ja-JP",
        description: "Japanese",
        ttsPreview: "日本語を話すことができます",
    },
];

export type AppLanguage = {
    id: string;
    description: string;
};

export const APP_LANGUAGES: AppLanguage[] = [
    {
        id: "en-US",
        description: "English",
    },
    {
        id: "ja-JP",
        description: "Japanese",
    },
];
