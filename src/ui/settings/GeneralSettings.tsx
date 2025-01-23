import * as React from "react";
import { AppSettings } from "../../models/app-settings";
import SlRadioGroup from "@shoelace-style/shoelace/dist/react/radio-group";
import SlRadioButton from "@shoelace-style/shoelace/dist/react/radio-button";

interface GeneralSettingsProps {
    settings: AppSettings;
    onSettingsChange: (settings: AppSettings) => void;
}

export const GeneralSettings: React.FC<GeneralSettingsProps> = ({ settings, onSettingsChange }) => {
    const handleLanguageChange = (language: string) => {
        onSettingsChange({
            ...settings,
            language,
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
            <SlRadioGroup
                label="Select Language"
                name="language"
                value={settings.language}
                onSlChange={(e) => handleLanguageChange((e.target as HTMLInputElement).value)}
            >
                <SlRadioButton value="en">English</SlRadioButton>
                <SlRadioButton value="jp">Japanese</SlRadioButton>
            </SlRadioGroup>

            <SlRadioGroup
                label="Theme"
                name="theme"
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
