import * as React from "react";
import "./NumberTrainer.css";
import { NumberTrainerMenu } from "./NumberTrainerMenu";
import { NumberTrainerActivity } from "./NumberTrainerActivity";
import { AppSettings } from "../../models/app-settings";
import SlBadge from "@shoelace-style/shoelace/dist/react/badge";
import SlIconButton from "@shoelace-style/shoelace/dist/react/icon-button";
import { TARGET_LANGUAGES } from "../../shared/languages";
import { NUMBER_CHALLENGE_DEFAULT_DIFFICULTY } from "./NumberChallengeDefaults";

type Props = {
    settings: AppSettings;
    onSettingsChange: (settings: AppSettings) => void;
};

export const NumberTrainer: React.FC<Props> = ({ settings, onSettingsChange }) => {
    const [isPlaying, setIsPlaying] = React.useState(false);

    const handleStart = () => setIsPlaying(true);
    const handleStop = () => setIsPlaying(false);

    const config =
        settings.numberTrainerDifficulty === "custom" && settings.numberTrainerCustomConfig
            ? settings.numberTrainerCustomConfig
            : NUMBER_CHALLENGE_DEFAULT_DIFFICULTY.find((round) => round.label === settings.numberTrainerDifficulty);

    return (
        <div className="trainer-container number-trainer">
            <div>
                <div className="spacer trainer-header">
                    <div>
                        <h2>Number Trainer</h2>
                    </div>
                    <div>
                        {isPlaying && (
                            <SlIconButton
                                name="x-lg"
                                style={{ fontSize: "0.75rem", verticalAlign: "middle" }}
                                onClick={handleStop}
                            />
                        )}
                        {config && (
                            <SlBadge
                                variant="primary"
                                pill
                                style={{ fontSize: "0.75rem", verticalAlign: "middle", marginRight: "4px" }}
                            >
                                {config.label}
                            </SlBadge>
                        )}
                        <SlBadge variant="primary" pill style={{ fontSize: "0.75rem", verticalAlign: "middle" }}>
                            {TARGET_LANGUAGES.find((l) => l.id === settings.targetLanguage)?.description}
                        </SlBadge>
                    </div>
                </div>
                <div className="trainer-content">
                    {isPlaying ? (
                        <NumberTrainerActivity settings={settings} config={config} />
                    ) : (
                        <NumberTrainerMenu
                            settings={settings}
                            onStart={handleStart}
                            onSettingsChange={onSettingsChange}
                        />
                    )}
                </div>
                <div className="spacer"></div>
            </div>
        </div>
    );
};
