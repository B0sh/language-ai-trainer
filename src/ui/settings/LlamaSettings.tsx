import * as React from "react";
import { AppSettings } from "../../models/app-settings";
import SlIconButton from "@shoelace-style/shoelace/dist/react/icon-button";
import SlTooltip from "@shoelace-style/shoelace/dist/react/tooltip";
import SlSelect from "@shoelace-style/shoelace/dist/react/select";
import SlOption from "@shoelace-style/shoelace/dist/react/option";
import SlAlert from "@shoelace-style/shoelace/dist/react/alert";
import SlButton from "@shoelace-style/shoelace/dist/react/button";
import { LlamaProvider } from "../../ai/llama/LlamaProvider";
import { LlamaModel } from "../../ai/llama/LlamaModel";

interface LlamaSettingsProps {
    settings: AppSettings;
    onSettingsChange: (settings: AppSettings) => void;
}

export const LlamaSettings: React.FC<LlamaSettingsProps> = ({ settings, onSettingsChange }) => {
    const [models, setModels] = React.useState<LlamaModel[]>([]);
    const [error, setError] = React.useState<string>("");

    const fetchModels = async () => {
        try {
            const response = await LlamaProvider.listModels();
            if (response.models.length === 0) {
                setError(
                    "Llama was installed successfully, but no models were found. Please install a model and try again."
                );
            }
            setModels(response.models);
            setError("");
        } catch (err) {
            setError("Unable to retrieve Llama models. Please ensure Llama is installed on your computer.");
            console.error("Error fetching Llama models:", err);
        }
    };

    React.useEffect(() => {
        fetchModels();
    }, []);

    const handleConfigChange = (field: string, value: string) => {
        onSettingsChange({
            ...settings,
            configs: {
                ...settings.configs,
                llama: {
                    ...settings.configs.llama,
                    [field]: value.trim(),
                },
            },
        });
    };

    return (
        <div>
            <h3>
                Llama
                <SlTooltip content="Supports Llama models">
                    <SlIconButton
                        name="box-arrow-up-right"
                        onClick={() => {
                            window.electron.ipcRenderer.invoke("open-external-url", "https://ollama.com/");
                        }}
                    />
                </SlTooltip>
            </h3>

            {error && (
                <div>
                    <SlAlert variant="danger" closable>
                        {error}
                    </SlAlert>
                    <SlButton onClick={fetchModels}>Refresh Models</SlButton>
                </div>
            )}

            <SlSelect
                label="Model"
                align-right
                value={settings.configs.llama?.model || ""}
                onSlChange={(e) => handleConfigChange("model", (e.target as HTMLSelectElement).value)}
                disabled={models.length === 0}
            >
                {models.map((model) => (
                    <SlOption key={model.name} value={model.name}>
                        {model.name} ({model.details.parameter_size})
                    </SlOption>
                ))}
            </SlSelect>
        </div>
    );
};
