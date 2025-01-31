import React, { useEffect } from "react";
import SlDialog from "@shoelace-style/shoelace/dist/react/dialog";
import SlButton from "@shoelace-style/shoelace/dist/react/button";
import SlInput from "@shoelace-style/shoelace/dist/react/input";
import SlFormatNumber from "@shoelace-style/shoelace/dist/react/format-number";
import type SlInputElement from "@shoelace-style/shoelace/dist/components/input/input";
import { AppSettings } from "../../models/app-settings";
import { NumberChallengeRoundConfig } from "./NumberChallenge";

interface Props {
    settings: AppSettings;
    onSettingsChange: (settings: AppSettings) => void;
    open: boolean;
    onClose: () => void;
}

export const CustomSettingsDialog: React.FC<Props> = ({ settings, onSettingsChange, open, onClose }) => {
    const [customMin, setCustomMin] = React.useState(settings.numberTrainerCustomConfig?.generators[0]?.min ?? 1);
    const [customMax, setCustomMax] = React.useState(settings.numberTrainerCustomConfig?.generators[0]?.max ?? 100);
    const [customMultiplier, setCustomMultiplier] = React.useState(
        settings.numberTrainerCustomConfig?.generators[0]?.multiplier ?? 1
    );

    useEffect(() => {
        if (settings.numberTrainerCustomConfig) {
            setCustomMin(settings.numberTrainerCustomConfig.generators[0]?.min ?? 1);
            setCustomMax(settings.numberTrainerCustomConfig.generators[0]?.max ?? 100);
            setCustomMultiplier(settings.numberTrainerCustomConfig.generators[0]?.multiplier ?? 1);
        }
    }, [open, settings.numberTrainerCustomConfig]);

    const handleSubmit = () => {
        const customConfig: NumberChallengeRoundConfig = {
            label: "Custom",
            helpText: `Generates numbers from ${customMin} to ${customMax} × ${customMultiplier}`,
            generators: [
                {
                    type: "random",
                    weight: 1,
                    min: customMin,
                    max: customMax,
                    multiplier: customMultiplier,
                },
            ],
        };

        onSettingsChange({
            ...settings,
            numberTrainerDifficulty: "custom",
            numberTrainerCustomConfig: customConfig,
        });
        onClose();
    };

    const handleMinChange = (event: Event) => {
        const input = event.target as SlInputElement;
        const value = parseInt(input.value, 10);
        if (value) {
            if (value < 1) {
                setCustomMin(1);
            } else if (value > customMax) {
                setCustomMin(customMax);
            } else {
                setCustomMin(value);
            }
        }
    };

    const handleMaxChange = (event: Event) => {
        const input = event.target as SlInputElement;
        const value = parseInt(input.value, 10);
        if (value) {
            if (value < customMin) {
                setCustomMax(customMin);
            } else if (value > 1000000000) {
                setCustomMax(1000000000);
            } else {
                setCustomMax(value);
            }
        }
    };

    return (
        <SlDialog label="Custom Number Trainer Settings" open={open} onSlAfterHide={onClose}>
            <div style={{ padding: "1rem" }}>
                <div style={{ marginBottom: "1rem" }}>
                    <SlInput
                        align-right
                        label="Minimum"
                        type="number"
                        value={customMin.toString()}
                        onSlInput={handleMinChange}
                        maxlength={customMax.toString().length}
                        min="1"
                        max={customMax.toString()}
                    />
                </div>
                <div style={{ marginBottom: "1rem" }}>
                    <SlInput
                        align-right
                        label="Maximum"
                        type="number"
                        value={customMax.toString()}
                        onSlInput={handleMaxChange}
                        min={customMin.toString()}
                        max="1000000000"
                    />
                </div>
                <div style={{ marginBottom: "1rem" }}>
                    <SlInput
                        align-right
                        label="Multiplier"
                        type="number"
                        value={customMultiplier.toString()}
                        onSlInput={(e) => setCustomMultiplier(parseInt((e.target as HTMLInputElement).value) || 1)}
                        min="1"
                        max="1000000"
                    />
                </div>
                <div>
                    <p>
                        Effective Range: <SlFormatNumber value={customMin * customMultiplier} /> to{" "}
                        <SlFormatNumber value={customMax * customMultiplier} />
                    </p>
                </div>
            </div>
            <div slot="footer">
                <SlButton variant="default" onClick={onClose}>
                    Cancel
                </SlButton>
                <SlButton variant="primary" onClick={handleSubmit}>
                    Save
                </SlButton>
            </div>
        </SlDialog>
    );
};
