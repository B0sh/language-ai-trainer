import * as React from "react";
import { AppSettings } from "../../models/app-settings";
import SlRadioGroup from "@shoelace-style/shoelace/dist/react/radio-group";
import SlRadioButton from "@shoelace-style/shoelace/dist/react/radio-button";
import SlSelect from "@shoelace-style/shoelace/dist/react/select";
import SlOption from "@shoelace-style/shoelace/dist/react/option";
import { APP_LANGUAGES, TARGET_LANGUAGES } from "../../shared/constants";

interface GeneralSettingsProps {
    settings: AppSettings;
    onSettingsChange: (settings: AppSettings) => void;
}

export const GeneralSettings: React.FC<GeneralSettingsProps> = ({ settings, onSettingsChange }) => {
    const handleAppLanguageChange = (language: string) => {
        onSettingsChange({
            ...settings,
            appLanguage: language,
        });
    };

    const handleTargetLanguageChange = (language: string) => {
        onSettingsChange({
            ...settings,
            targetLanguage: language,
        });
    };

    const handleThemeChange = (theme: string) => {
        onSettingsChange({
            ...settings,
            theme,
        });
    };

    return (
        <div>
            <h2>App Settings</h2>
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

            <SlRadioGroup
                label="App Language"
                name="appLanguage"
                align-right
                value={settings.appLanguage}
                onSlChange={(e) => handleAppLanguageChange((e.target as HTMLInputElement).value)}
            >
                {APP_LANGUAGES.map((lang) => (
                    <SlRadioButton key={lang.id} value={lang.id}>
                        {lang.description}
                    </SlRadioButton>
                ))}
            </SlRadioGroup>

            <SlRadioGroup
                label="Theme"
                name="theme"
                align-right
                value={settings.theme}
                onSlChange={(e) => handleThemeChange((e.target as HTMLInputElement).value)}
            >
                <SlRadioButton value="light">Light</SlRadioButton>
                <SlRadioButton value="dark">Dark</SlRadioButton>
                <SlRadioButton value="auto">Auto</SlRadioButton>
            </SlRadioGroup>
        </div>
    );
};
