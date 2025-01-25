import React, { useCallback, useEffect, useState } from "react";
import { NumberChallenge, NumberChallengeStatus } from "./NumberChallenge";
import { NumberTrainerRound } from "./NumberTrainerRound";
import { TrainerFeedback } from "../shared/Trainer/TrainerFeedback";
import SlFormatNumber from "@shoelace-style/shoelace/dist/react/format-number";
import { AppSettings } from "../../models/app-settings";
import { AIProviderRegistry } from "../../ai/registry";

interface NumberTrainerActivityProps {
    settings: AppSettings;
    onStop: () => void;
}

export const NumberTrainerActivity: React.FC<NumberTrainerActivityProps> = ({ settings, onStop }) => {
    const [challenge] = useState(() => new NumberChallenge());
    const [playbackStatus, setPlaybackStatus] = useState<string>("");
    const [, forceUpdate] = useState({});

    const handleSubmit = useCallback(
        (userInput: string) => {
            const isCorrect = challenge.checkAnswer(userInput);
            if (isCorrect) {
                challenge.setStatus("correct");
            } else {
                challenge.setStatus("incorrect");
                challenge.playAudio();
            }
            forceUpdate({});
        },
        [challenge]
    );

    const speakNumber = useCallback(async () => {
        setPlaybackStatus("loading");
        try {
            await challenge.generateAudio(settings.targetLanguage);
            setPlaybackStatus("playing");
            await challenge.playAudio();
            setPlaybackStatus("finished");
        } catch (error) {
            const provider = AIProviderRegistry.getActiveProvider("tts");
            throw new Error(`Failed to generate speech with ${provider.name}.\n${error}`);
        }
    }, [challenge, settings.targetLanguage]);

    useEffect(() => {
        speakNumber();
    }, [speakNumber]);

    const handleNextRound = useCallback(() => {
        challenge.nextRound();
        speakNumber();
        forceUpdate({});
    }, [challenge]);

    return (
        <>
            {challenge.status === "correct" || challenge.status === "incorrect" ? (
                <TrainerFeedback
                    playbackStatus={playbackStatus}
                    message={
                        <div>
                            The number was{" "}
                            <SlFormatNumber value={challenge.currentNumber} lang={settings.appLanguage} />.
                        </div>
                    }
                    status={challenge.status}
                    onNextRound={handleNextRound}
                    onReplayAudio={speakNumber}
                />
            ) : (
                <NumberTrainerRound
                    playbackStatus={playbackStatus}
                    status={challenge.status}
                    streak={challenge.streak}
                    onSubmit={handleSubmit}
                />
            )}
        </>
    );
};
