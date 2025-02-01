import * as React from "react";
import "./CompTrainer.css";
import SlBadge from "@shoelace-style/shoelace/dist/react/badge";
import SlIconButton from "@shoelace-style/shoelace/dist/react/icon-button";
import { AppSettings } from "../../models/app-settings";
import { getTargetLanguage } from "../../shared/languages";
import { CompTrainerMenu } from "./CompTrainerMenu";
import { CompTrainerActivity } from "./CompTrainerActivity";
import { TrainerHeaderBadges } from "../shared/Trainer/TrainerHeaderBadges";

type Props = {
    settings: AppSettings;
    onSettingsChange: (settings: AppSettings) => void;
};

export const CompTrainer: React.FC<Props> = ({ settings, onSettingsChange }) => {
    const [isPlaying, setIsPlaying] = React.useState(false);

    const handleStart = () => setIsPlaying(true);
    const handleStop = () => setIsPlaying(false);

    const language = getTargetLanguage(settings.targetLanguage);

    return (
        <div className="trainer-container comp-trainer">
            <div>
                <div className="spacer trainer-header">
                    <div>
                        <h2>Comprehension Trainer</h2>
                    </div>
                    <TrainerHeaderBadges isPlaying={isPlaying} onStop={handleStop} language={language} />
                </div>
                <div className="trainer-content">
                    {isPlaying ? (
                        <CompTrainerActivity settings={settings} />
                    ) : (
                        <CompTrainerMenu
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
