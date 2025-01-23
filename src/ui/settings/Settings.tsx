import SlSelect from "@shoelace-style/shoelace/dist/react/select";
import SlOption from "@shoelace-style/shoelace/dist/react/option";
import * as React from "react";
import SlRadioGroup from "@shoelace-style/shoelace/dist/react/radio-group";
import SlRadioButton from "@shoelace-style/shoelace/dist/react/radio-button";
import SlInput from "@shoelace-style/shoelace/dist/react/input";
import SlDivider from "@shoelace-style/shoelace/dist/react/divider";
import { AIProviderRegistry } from "../../ai/registry";
import { useEffect, useState } from "react";

interface ProviderConfig {
    apiKey?: string;
    organization?: string;
}

interface ProviderSettings {
    tts: string;
    stt: string;
    llm: string;
    configs: Record<string, ProviderConfig>;
}

const defaultSettings: ProviderSettings = {
    tts: "browser",
    stt: "openai",
    llm: "openai",
    configs: {
        openai: { apiKey: "", organization: "" },
    },
};

export const Settings: React.FC = () => {
    const [settings, setSettings] = useState<ProviderSettings>(() => {
        const saved = localStorage.getItem("aiSettings");
        return saved ? JSON.parse(saved) : defaultSettings;
    });
    const [providers] = useState(() => AIProviderRegistry.getAvailableProviders());

    // Save settings to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem("aiSettings", JSON.stringify(settings));

        // Update active providers
        try {
            const updateProvider = async (type: "tts" | "stt" | "llm") => {
                const ProviderClass = AIProviderRegistry.getProviderClass(settings[type]);
                const provider = new ProviderClass();
                const config = settings.configs[settings[type]];
                if (config && provider.configure) {
                    provider.configure(config);
                }
                AIProviderRegistry.setActiveProvider(type, provider);
            };

            updateProvider("tts");
            updateProvider("stt");
            updateProvider("llm");
        } catch (error) {
            console.error("Failed to update AI providers:", error);
        }
    }, [settings]);

    const handleProviderChange = (type: "tts" | "stt" | "llm", providerId: string) => {
        setSettings((prev) => ({
            ...prev,
            [type]: providerId,
        }));
    };

    const handleConfigChange = (providerId: string, field: string, value: string) => {
        setSettings((prev) => ({
            ...prev,
            configs: {
                ...prev.configs,
                [providerId]: {
                    ...prev.configs[providerId],
                    [field]: value,
                },
            },
        }));
    };

    return (
        <div className="settings-container" style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
            <h2>Language Settings</h2>
            <SlRadioGroup label="Select Language" name="language" value="en" style={{ marginBottom: "20px" }}>
                <SlRadioButton value="en">English</SlRadioButton>
                <SlRadioButton value="jp">Japanese</SlRadioButton>
            </SlRadioGroup>

            <SlDivider style={{ margin: "20px 0" }} />

            <h2>AI Provider Settings</h2>

            <div style={{ marginBottom: "20px" }}>
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
            </div>

            <div style={{ marginBottom: "20px" }}>
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
            </div>

            <div style={{ marginBottom: "20px" }}>
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

            {settings.configs.openai && (
                <div style={{ marginTop: "20px" }}>
                    <h3>OpenAI Configuration</h3>
                    <div style={{ marginBottom: "15px" }}>
                        <SlInput
                            label="API Key"
                            type="password"
                            value={settings.configs.openai.apiKey}
                            onSlChange={(e) =>
                                handleConfigChange("openai", "apiKey", (e.target as HTMLInputElement).value)
                            }
                        />
                    </div>
                    <div style={{ marginBottom: "15px" }}>
                        <SlInput
                            label="Organization ID (optional)"
                            type="text"
                            value={settings.configs.openai.organization}
                            onSlChange={(e) =>
                                handleConfigChange("openai", "organization", (e.target as HTMLInputElement).value)
                            }
                        />
                    </div>
                </div>
            )}
        </div>
    );
};
