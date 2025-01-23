export type TargetLanguage = {
    id: string;
    description: string;
};

export const TARGET_LANGUAGES: TargetLanguage[] = [
    {
        id: "en",
        description: "English",
    },
    {
        id: "ja",
        description: "Japanese",
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
