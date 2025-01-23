import * as React from "react";
import "./NumberTrainer.css";
import { NumberTrainerMenu } from "./NumberTrainerMenu";
import { NumberTrainerActivity } from "./NumberTrainerActivity";

export const NumberTrainer: React.FC = () => {
    const [isPlaying, setIsPlaying] = React.useState(false);

    const handleStart = () => setIsPlaying(true);
    const handleStop = () => setIsPlaying(false);

    return (
        <div className="number-trainer">
            <div className="game-container">
                {isPlaying ? (
                    <NumberTrainerActivity onStop={handleStop} />
                ) : (
                    <NumberTrainerMenu onStart={handleStart} />
                )}
            </div>
        </div>
    );
};
