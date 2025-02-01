export type TargetLanguage = {
    id: string;
    description: string;
    ttsPreview: string;
    emoji: string;
};

export const TARGET_LANGUAGES: TargetLanguage[] = [
    {
        id: "en-US",
        description: "English",
        ttsPreview: "I'm inside of Walden's AI Language Trainer.",
        emoji: "🇺🇸",
    },
    {
        id: "ja-JP",
        description: "Japanese",
        ttsPreview: "日本語を話すことができます",
        emoji: "🇯🇵",
    },
];

export function getTargetLanguage(id: string): TargetLanguage | undefined {
    return TARGET_LANGUAGES.find((l) => l.id === id);
}

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

export function getAppLanguage(id: string): AppLanguage | undefined {
    return APP_LANGUAGES.find((l) => l.id === id);
}
