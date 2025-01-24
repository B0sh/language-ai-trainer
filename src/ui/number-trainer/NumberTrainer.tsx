import * as React from "react";
import "./NumberTrainer.css";
import { NumberTrainerMenu } from "./NumberTrainerMenu";
import { NumberTrainerActivity } from "./NumberTrainerActivity";
import { AppSettings } from "../../models/app-settings";

type Props = {
    settings: AppSettings;
};

export const NumberTrainer: React.FC<Props> = ({ settings }) => {
    const [isPlaying, setIsPlaying] = React.useState(false);

    const handleStart = () => setIsPlaying(true);
    const handleStop = () => setIsPlaying(false);

    return (
        <div className="number-trainer">
            <div className="spacer">
                <h2>Number Trainer</h2>
            </div>
            <div className="game-container">
                {isPlaying ? (
                    <NumberTrainerActivity targetLanguage={settings.targetLanguage} onStop={handleStop} />
                ) : (
                    <NumberTrainerMenu onStart={handleStart} />
                )}
            </div>
            <div className="spacer"></div>
        </div>
    );
};
