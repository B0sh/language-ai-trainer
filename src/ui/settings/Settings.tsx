import * as React from "react";
import SlDivider from "@shoelace-style/shoelace/dist/react/divider";
import { AppSettings } from "../../models/app-settings";
import { AIProviderSettings } from "./AIProviderSettings";
import { OpenAISettings } from "./OpenAISettings";
import { GoogleSettings } from "./GoogleSettings";
import { GeneralSettings } from "./GeneralSettings";
import { LlamaSettings } from "./LlamaSettings";

interface SettingsProps {
    settings: AppSettings;
    onSettingsChange: (settings: AppSettings) => void;
}

export const Settings: React.FC<SettingsProps> = ({ settings, onSettingsChange }) => {
    return (
        <div
            className="settings-container form-control"
            style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}
        >
            <GeneralSettings settings={settings} onSettingsChange={onSettingsChange} />

            <SlDivider />

            <AIProviderSettings settings={settings} onSettingsChange={onSettingsChange} />

            {settings.tts === "openai" || settings.stt === "openai" || settings.llm === "openai" ? (
                <>
                    <SlDivider />
                    <OpenAISettings settings={settings} onSettingsChange={onSettingsChange} />
                </>
            ) : null}

            {settings.tts === "google" || settings.stt === "google" || settings.llm === "google" ? (
                <>
                    <SlDivider />
                    <GoogleSettings settings={settings} onSettingsChange={onSettingsChange} />
                </>
            ) : null}

            {settings.tts === "llama" || settings.stt === "llama" || settings.llm === "llama" ? (
                <>
                    <SlDivider />
                    <LlamaSettings settings={settings} onSettingsChange={onSettingsChange} />
                </>
            ) : null}
        </div>
    );
};
