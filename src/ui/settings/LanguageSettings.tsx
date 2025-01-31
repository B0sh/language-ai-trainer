import * as React from "react";
import { AppSettings } from "../../models/app-settings";
import SlSelect from "@shoelace-style/shoelace/dist/react/select";
import SlOption from "@shoelace-style/shoelace/dist/react/option";
import { TARGET_LANGUAGES } from "../../shared/languages";

interface Props {
    settings: AppSettings;
    onSettingsChange: (settings: AppSettings) => void;
}

export const LanguageSettings: React.FC<Props> = ({ settings, onSettingsChange }) => {
    const handleTargetLanguageChange = (language: string) => {
        onSettingsChange({
            ...settings,
            targetLanguage: language,
        });
    };

    return (
        <div>
            <h2>Language Settings</h2>
            <SlSelect
                label="Target Language"
                name="targetLanguage"
                align-right
                value={settings.targetLanguage}
                onSlChange={(e) => handleTargetLanguageChange((e.target as HTMLInputElement).value)}
            >
                {TARGET_LANGUAGES.map((lang) => (
                    <SlOption key={lang.id} value={lang.id}>
                        {lang.description}
                    </SlOption>
                ))}
            </SlSelect>
        </div>
    );
};
