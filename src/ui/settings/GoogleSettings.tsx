import * as React from "react";
import { AppSettings } from "../../models/app-settings";
import SlInput from "@shoelace-style/shoelace/dist/react/input";

interface GoogleSettingsProps {
    settings: AppSettings;
    onSettingsChange: (settings: AppSettings) => void;
}

export const GoogleSettings: React.FC<GoogleSettingsProps> = ({ settings, onSettingsChange }) => {
    const handleConfigChange = (field: string, value: string) => {
        onSettingsChange({
            ...settings,
            configs: {
                ...settings.configs,
                google: {
                    ...settings.configs.google,
                    [field]: value,
                },
            },
        });
    };

    return (
        <div>
            <h3>Google Configuration</h3>
            <SlInput
                label="API Key"
                type="password"
                required
                value={settings.configs.google?.apiKey}
                onSlChange={(e) => handleConfigChange("apiKey", (e.target as HTMLInputElement).value)}
            />
        </div>
    );
};
