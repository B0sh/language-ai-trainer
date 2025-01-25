import * as React from "react";
import "./NumberTrainer.css";
import { NumberTrainerMenu } from "./NumberTrainerMenu";
import { NumberTrainerActivity } from "./NumberTrainerActivity";
import { AppSettings } from "../../models/app-settings";
import SlBadge from "@shoelace-style/shoelace/dist/react/badge";
import { TARGET_LANGUAGES } from "../../shared/languages";

type Props = {
    settings: AppSettings;
};

export const NumberTrainer: React.FC<Props> = ({ settings }) => {
    const [isPlaying, setIsPlaying] = React.useState(false);

    const handleStart = () => setIsPlaying(true);
    const handleStop = () => setIsPlaying(false);

    return (
        <div className="trainer-container">
            <div className="spacer trainer-header">
                <div>
                    <h2>Number Trainer</h2>
                </div>
                <div>
                    <SlBadge
                        variant="primary"
                        pill
                        style={{ fontSize: "0.75rem", verticalAlign: "middle", marginLeft: "10px" }}
                    >
                        {TARGET_LANGUAGES.find((l) => l.id === settings.targetLanguage)?.description}
                    </SlBadge>
                </div>
            </div>
            <div className="trainer-content">
                {isPlaying ? (
                    <NumberTrainerActivity settings={settings} onStop={handleStop} />
                ) : (
                    <NumberTrainerMenu settings={settings} onStart={handleStart} />
                )}
            </div>
            <div className="spacer"></div>
        </div>
    );
};
