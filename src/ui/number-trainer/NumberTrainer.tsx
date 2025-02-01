import * as React from "react";
import "./NumberTrainer.css";
import { NumberTrainerMenu } from "./NumberTrainerMenu";
import { NumberTrainerActivity } from "./NumberTrainerActivity";
import { AppSettings } from "../../models/app-settings";
import SlBadge from "@shoelace-style/shoelace/dist/react/badge";
import SlIconButton from "@shoelace-style/shoelace/dist/react/icon-button";
import { getTargetLanguage } from "../../shared/languages";
import { NUMBER_CHALLENGE_DEFAULT_DIFFICULTY } from "./NumberChallengeDefaults";
import { TrainerHeaderBadges } from "../shared/Trainer/TrainerHeaderBadges";

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
    const language = getTargetLanguage(settings.targetLanguage);

    return (
        <div className="trainer-container number-trainer">
            <div>
                <div className="spacer trainer-header">
                    <div>
                        <h2>Number Trainer</h2>
                    </div>
                    <TrainerHeaderBadges
                        isPlaying={isPlaying}
                        onStop={handleStop}
                        language={language}
                        configLabel={config?.label}
                    />
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
