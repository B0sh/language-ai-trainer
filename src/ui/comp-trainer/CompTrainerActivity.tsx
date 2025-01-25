import React, { useCallback, useEffect, useState } from "react";
import { TrainerFeedback } from "../shared/Trainer/TrainerFeedback";
import { AppSettings } from "../../models/app-settings";
import { AIProviderRegistry } from "../../ai/registry";
import { CompChallenge } from "./CompChallenge";
import { CompTrainerRound } from "./CompTrainerRound";

interface Props {
    settings: AppSettings;
    onStop: () => void;
}

export const CompTrainerActivity: React.FC<Props> = ({ settings, onStop }) => {
    const [challenge] = useState(() => new CompChallenge(settings.targetLanguage));
    const [playbackStatus, setPlaybackStatus] = useState<string>("");
    const [, forceUpdate] = useState({});

    const handleSubmit = useCallback(
        (userInput: string) => {
            const isCorrect = challenge.checkComprehension(userInput);
            console.log(isCorrect);

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

    const generateProblem = useCallback(async () => {
        setPlaybackStatus("loading");
        try {
            await challenge.generateProblem();
            setPlaybackStatus("playing");
            await challenge.playAudio();
            setPlaybackStatus("finished");
        } catch (error) {
            // Can I show error for which part that failed?
            const provider = AIProviderRegistry.getActiveProvider("tts");
            throw new Error(`Failed to generate speech with ${provider.name}.\n${error}`);
        }
    }, [challenge]);

    useEffect(() => {
        generateProblem();

        return () => {
            challenge.stopAudio();
        };
    }, [generateProblem]);

    const handleNextRound = useCallback(() => {
        challenge.nextRound();
        generateProblem();
        forceUpdate({});
    }, [challenge]);

    return (
        <>
            {challenge.storyText}

            {challenge.status === "correct" || challenge.status === "incorrect" ? (
                <TrainerFeedback
                    playbackStatus={playbackStatus}
                    message={<div>{challenge.storyText}</div>}
                    status={challenge.status}
                    onNextRound={handleNextRound}
                    onReplayAudio={generateProblem}
                />
            ) : (
                <CompTrainerRound
                    playbackStatus={playbackStatus}
                    status={challenge.status}
                    streak={challenge.streak}
                    onSubmit={handleSubmit}
                />
            )}
        </>
    );
};
