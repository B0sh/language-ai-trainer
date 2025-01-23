import * as React from "react";
import { AppSettings } from "../../models/app-settings";
import SlInput from "@shoelace-style/shoelace/dist/react/input";

interface OpenAISettingsProps {
    settings: AppSettings;
    onSettingsChange: (settings: AppSettings) => void;
}

export const OpenAISettings: React.FC<OpenAISettingsProps> = ({ settings, onSettingsChange }) => {
    const handleConfigChange = (field: string, value: string) => {
        onSettingsChange({
            ...settings,
            configs: {
                ...settings.configs,
                openai: {
                    ...settings.configs.openai,
                    [field]: value,
                },
            },
        });
    };

    return (
        <div>
            <h3>OpenAI Configuration</h3>
            <SlInput
                label="API Key"
                type="password"
                required
                value={settings.configs.openai.apiKey}
                onSlChange={(e) => handleConfigChange("apiKey", (e.target as HTMLInputElement).value)}
            />
            <SlInput
                label="Organization ID (optional)"
                type="text"
                value={settings.configs.openai.organization}
                onSlChange={(e) => handleConfigChange("organization", (e.target as HTMLInputElement).value)}
            />
        </div>
    );
};
