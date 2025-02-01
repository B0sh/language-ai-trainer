import * as React from "react";
import "./CompTrainer.css";
import SlBadge from "@shoelace-style/shoelace/dist/react/badge";
import SlIconButton from "@shoelace-style/shoelace/dist/react/icon-button";
import { AppSettings } from "../../models/app-settings";
import { getTargetLanguage } from "../../shared/languages";
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

    const language = getTargetLanguage(settings.targetLanguage);

    return (
        <div className="trainer-container comp-trainer">
            <div>
                <div className="spacer trainer-header">
                    <div>
                        <h2>Comprehension Trainer</h2>
                    </div>
                    <div>
                        {isPlaying && (
                            <SlIconButton
                                name="x-lg"
                                style={{ fontSize: "0.75rem", verticalAlign: "middle" }}
                                onClick={handleStop}
                            />
                        )}
                        <SlBadge variant="primary" pill style={{ fontSize: "0.75rem", verticalAlign: "middle" }}>
                            {language.description}
                        </SlBadge>
                    </div>
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
