import * as React from "react";
import { useState } from "react";
import { AppSettings } from "../../models/app-settings";
import { AIProviderRegistry } from "../../ai/registry";
import SlSelect from "@shoelace-style/shoelace/dist/react/select";
import SlOption from "@shoelace-style/shoelace/dist/react/option";
import SlAlert from "@shoelace-style/shoelace/dist/react/alert";
import SlIcon from "@shoelace-style/shoelace/dist/react/icon";
import { AIProvider } from "../../ai/interfaces";

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

    const active: AIProvider[] = [
        AIProviderRegistry.getActiveProvider("tts"),
        AIProviderRegistry.getActiveProvider("stt"),
        AIProviderRegistry.getActiveProvider("llm"),
    ];

    const errors: Set<string> = new Set();
    for (const provider of active) {
        const validationMessage = provider.validateConfig();
        if (validationMessage) {
            errors.add(validationMessage);
        }
    }

    let errorAlert = null;
    if (errors.size > 0) {
        errorAlert = (
            <SlAlert variant="danger" open>
                <SlIcon slot="icon" name="exclamation-octagon" />
                <strong>Your selected configuration is invalid.</strong>
                <br />
                {Array.from(errors).map((e) => (
                    <div key={e}>{e}</div>
                ))}
            </SlAlert>
        );
    }

    return (
        <div>
            <h2>AI Provider Settings</h2>
            {errorAlert}

            <SlSelect
                label="Text-to-Speech Provider"
                align-right
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
                align-right
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
                label="LLM Provider"
                align-right
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
