import * as React from "react";
import { useState } from "react";
import { AppSettings } from "../../models/app-settings";
import { AIProviderRegistry } from "../../ai/registry";
import SlSelect from "@shoelace-style/shoelace/dist/react/select";
import SlOption from "@shoelace-style/shoelace/dist/react/option";

interface AIProviderSettingsProps {
    settings: AppSettings;
    onSettingsChange: (settings: AppSettings) => void;
}

export const AIProviderSettings: React.FC<AIProviderSettingsProps> = ({ settings, onSettingsChange }) => {
    const [providers] = useState(() => AIProviderRegistry.getAvailableProviders());

    const handleProviderChange = (type: "tts" | "stt" | "llm", providerId: string) => {
        onSettingsChange({
            ...settings,
            [type]: providerId,
        });
    };

    return (
        <div>
            <h2>AI Provider Settings</h2>
            <SlSelect
                label="Text-to-Speech Provider"
                value={settings.tts}
                onSlChange={(e) => handleProviderChange("tts", (e.target as HTMLSelectElement).value)}
            >
                {providers
                    .filter((p) => p.capabilities.canTextToSpeech)
                    .map((p) => (
                        <SlOption key={p.id} value={p.id}>
                            {p.name}
                        </SlOption>
                    ))}
            </SlSelect>
            <SlSelect
                label="Speech-to-Text Provider"
                value={settings.stt}
                onSlChange={(e) => handleProviderChange("stt", (e.target as HTMLSelectElement).value)}
            >
                {providers
                    .filter((p) => p.capabilities.canSpeechToText)
                    .map((p) => (
                        <SlOption key={p.id} value={p.id}>
                            {p.name}
                        </SlOption>
                    ))}
            </SlSelect>
            <SlSelect
                label="Text Generation Provider"
                value={settings.llm}
                onSlChange={(e) => handleProviderChange("llm", (e.target as HTMLSelectElement).value)}
            >
                {providers
                    .filter((p) => p.capabilities.canGenerateText)
                    .map((p) => (
                        <SlOption key={p.id} value={p.id}>
                            {p.name}
                        </SlOption>
                    ))}
            </SlSelect>
        </div>
    );
};