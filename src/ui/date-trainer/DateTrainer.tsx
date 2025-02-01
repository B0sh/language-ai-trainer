import SlBadge from "@shoelace-style/shoelace/dist/react/badge";
import SlIconButton from "@shoelace-style/shoelace/dist/react/icon-button";
import * as React from "react";
import { AppSettings } from "../../models/app-settings";
import { TARGET_LANGUAGES } from "../../shared/languages";
import { DATE_CHALLENGE_DEFAULT_DIFFICULTY } from "./DateChallengeDefaults";
import "./DateTrainer.css";
import { DateTrainerActivity } from "./DateTrainerActivity";
import { DateTrainerMenu } from "./DateTrainerMenu";

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

    return (
        <div className="trainer-container date-trainer">
            <div>
                <div className="spacer trainer-header">
                    <div>
                        <h2>Date Trainer</h2>
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
