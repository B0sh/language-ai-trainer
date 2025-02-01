import * as React from "react";
import { AppSettings } from "../../models/app-settings";
import { getTargetLanguage } from "../../shared/languages";
import { DATE_CHALLENGE_DEFAULT_DIFFICULTY } from "./DateChallengeDefaults";
import "./DateTrainer.css";
import { DateTrainerActivity } from "./DateTrainerActivity";
import { DateTrainerMenu } from "./DateTrainerMenu";
import { TrainerHeaderBadges } from "../shared/Trainer/TrainerHeaderBadges";

type Props = {
    settings: AppSettings;
    onSettingsChange: (settings: AppSettings) => void;
};

export const DateTrainer: React.FC<Props> = ({ settings, onSettingsChange }) => {
    const [isPlaying, setIsPlaying] = React.useState(false);

    const handleStart = () => setIsPlaying(true);
    const handleStop = () => setIsPlaying(false);

    const config =
        settings.dateTrainerDifficulty === "custom" && settings.dateTrainerCustomConfig
            ? settings.dateTrainerCustomConfig
            : DATE_CHALLENGE_DEFAULT_DIFFICULTY.find((round) => round.label === settings.dateTrainerDifficulty);
    const language = getTargetLanguage(settings.targetLanguage);

    return (
        <div className="trainer-container date-trainer">
            <div>
                <div className="spacer trainer-header">
                    <div>
                        <h2>Date Trainer</h2>
                    </div>
                    <TrainerHeaderBadges
                        isPlaying={isPlaying}
                        onStop={handleStop}
                        language={language}
                        configLabel={config?.label}
                        targetLanguageLevel={settings.targetLanguageLevel}
                    />
                </div>
                <div className="trainer-content">
                    {isPlaying ? (
                        <DateTrainerActivity settings={settings} config={config} />
                    ) : (
                        <DateTrainerMenu
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
