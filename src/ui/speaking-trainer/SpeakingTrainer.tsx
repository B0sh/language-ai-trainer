import * as React from "react";
import { AppSettings } from "../../models/app-settings";
import { getTargetLanguage } from "../../shared/languages";
import { TrainerHeaderBadges } from "../shared/Trainer/TrainerHeaderBadges";
import "./SpeakingTrainer.css";
import { SpeakingTrainerMenu } from "./SpeakingTrainerMenu";
import { AIConversation } from "./Conversation/AIConversation";

interface Props {
    settings: AppSettings;
    onSettingsChange: (settings: AppSettings) => void;
}

export const SpeakingTrainer: React.FC<Props> = ({ settings, onSettingsChange }) => {
    const [isPlaying, setIsPlaying] = React.useState(false);

    const handleStart = () => setIsPlaying(true);
    const handleStop = () => setIsPlaying(false);

    const language = getTargetLanguage(settings.targetLanguage);

    if (isPlaying) {
        return <AIConversation settings={settings} />;
    }

    return (
        <div className="trainer-container conversation-trainer">
            <div>
                <div className="spacer trainer-header">
                    <div>
                        <h2>Conversation Trainer</h2>
                    </div>
                    <TrainerHeaderBadges
                        isPlaying={isPlaying}
                        onStop={handleStop}
                        language={language}
                        targetLanguageLevel={settings.targetLanguageLevel}
                    />
                </div>
                <div className="trainer-content">
                    <SpeakingTrainerMenu
                        settings={settings}
                        onStart={handleStart}
                        onSettingsChange={onSettingsChange}
                    />
                </div>
                <div className="spacer"></div>
            </div>
        </div>
    );
};
