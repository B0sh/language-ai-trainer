import * as React from "react";
import "./CompTrainer.css";
import SlBadge from "@shoelace-style/shoelace/dist/react/badge";
import { AppSettings } from "../../models/app-settings";
import { TARGET_LANGUAGES } from "../../shared/languages";
import { CompTrainerMenu } from "./CompTrainerMenu";
import { CompTrainerActivity } from "./CompTrainerActivity";

type Props = {
    settings: AppSettings;
    onSettingsChange: (settings: AppSettings) => void;
};

export const CompTrainer: React.FC<Props> = ({ settings, onSettingsChange }) => {
    const [isPlaying, setIsPlaying] = React.useState(false);

    const handleStart = () => setIsPlaying(true);
    const handleStop = () => setIsPlaying(false);

    return (
        <div className="trainer-container">
            <div>
                <div className="spacer trainer-header">
                    <div>
                        <h2>Comprehension Trainer</h2>
                    </div>
                    <div>
                        <SlBadge variant="primary" pill style={{ fontSize: "0.75rem", verticalAlign: "middle" }}>
                            {TARGET_LANGUAGES.find((l) => l.id === settings.targetLanguage)?.description}
                        </SlBadge>
                    </div>
                </div>
                <div className="trainer-content">
                    {isPlaying ? (
                        <CompTrainerActivity settings={settings} onStop={handleStop} />
                    ) : (
                        <CompTrainerMenu
                            settings={settings}
                            onStart={handleStart}
                            onSettingsChange={onSettingsChange}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};
