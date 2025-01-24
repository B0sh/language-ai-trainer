import * as React from "react";
import { AppSettings } from "../../models/app-settings";
import { LlamaProvider } from "../../ai/llama/LlamaProvider";
import { LlamaModel } from "../../ai/llama/LlamaModel";
import { openUrl } from "../../shared/utility";
import SlSpinner from "@shoelace-style/shoelace/dist/react/spinner";
import SlIconButton from "@shoelace-style/shoelace/dist/react/icon-button";
import SlTooltip from "@shoelace-style/shoelace/dist/react/tooltip";
import SlSelect from "@shoelace-style/shoelace/dist/react/select";
import SlOption from "@shoelace-style/shoelace/dist/react/option";
import SlAlert from "@shoelace-style/shoelace/dist/react/alert";
import SlIcon from "@shoelace-style/shoelace/dist/react/icon";
import ExternalLink from "../shared/ExternalLink";

interface LlamaSettingsProps {
    settings: AppSettings;
    onSettingsChange: (settings: AppSettings) => void;
}

export const LlamaSettings: React.FC<LlamaSettingsProps> = ({ settings, onSettingsChange }) => {
    const [models, setModels] = React.useState<LlamaModel[]>([]);
    const [error, setError] = React.useState<string>("");
    const [loading, setLoading] = React.useState<boolean>(false);

    const fetchModels = React.useCallback(async () => {
        if (loading) {
            return;
        }

        setError("");
        setLoading(true);
        setModels([]);

        try {
            const response = await LlamaProvider.listModels();

            setLoading(false);
            setModels(response.models);

            if (response.models.length === 0) {
                setError(
                    "No Llama models are available. To use Llama locally, install Ollama and install a Llama model."
                );
            }
        } catch (err) {
            setLoading(false);
            setError("Unable to connect to Llama. To use Llama locally, install Ollama and install a Llama model.");
        }
    }, [loading]);

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
                <SlTooltip content="Learn how to install Ollama">
                    <SlIconButton name="box-arrow-up-right" onClick={() => openUrl("https://ollama.com/")} />
                </SlTooltip>
                <SlTooltip content="Refresh Llama model list">
                    {loading ? (
                        <SlSpinner />
                    ) : (
                        <SlIconButton name="arrow-clockwise" onClick={fetchModels}></SlIconButton>
                    )}
                </SlTooltip>
            </h3>

            {error ? (
                <div style={{ marginTop: "1rem" }}>
                    <SlAlert variant="danger" open>
                        <SlIcon slot="icon" name="exclamation-octagon" />
                        {error} <ExternalLink href="https://ollama.com/">Learn more</ExternalLink>
                    </SlAlert>
                </div>
            ) : (
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
            )}
        </div>
    );
};
