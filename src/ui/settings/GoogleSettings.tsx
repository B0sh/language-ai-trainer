import * as React from "react";
import { AppSettings } from "../../models/app-settings";
import SlInput from "@shoelace-style/shoelace/dist/react/input";
import SlIconButton from "@shoelace-style/shoelace/dist/react/icon-button";
import SlTooltip from "@shoelace-style/shoelace/dist/react/tooltip";
import SlAlert from "@shoelace-style/shoelace/dist/react/alert";
import SlIcon from "@shoelace-style/shoelace/dist/react/icon";
import { openUrl } from "../../shared/utility";

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
                    [field]: value.trim(),
                },
            },
        });
    };

    return (
        <div>
            <h3>
                Google
                <SlTooltip content="Learn how to get an API key">
                    <SlIconButton
                        name="box-arrow-up-right"
                        onClick={() => openUrl("https://support.google.com/googleapi/answer/6158862?hl=en")}
                    />
                </SlTooltip>
            </h3>

            <SlInput
                label="API Key"
                type="password"
                align-right
                value={settings.configs.google?.apiKey}
                onSlChange={(e) => handleConfigChange("apiKey", (e.target as HTMLInputElement).value)}
            />

            <br />

            <SlAlert open>
                <SlIcon slot="icon" name="info-circle" />
                <strong>The Google API key requires the following permissions:</strong>
                <ul>
                    <li>Cloud Text-to-Speech API</li>
                    <li>Generative Language API</li>
                </ul>
            </SlAlert>
        </div>
    );
};
