import React, { useCallback, useEffect, useState } from "react";
import { TrainerFeedback } from "../shared/Trainer/TrainerFeedback";
import { AppSettings } from "../../models/app-settings";
import { AIProviderRegistry } from "../../ai/registry";
import { CompChallenge } from "./CompChallenge";
import { CompTrainerRound } from "./CompTrainerRound";
import { useErrorBoundary } from "react-error-boundary";

interface Props {
    settings: AppSettings;
    onStop: () => void;
}

export const CompTrainerActivity: React.FC<Props> = ({ settings, onStop }) => {
    const [challenge] = useState(() => new CompChallenge(settings.targetLanguage));
    const [playbackStatus, setPlaybackStatus] = useState<string>("");
    const [, forceUpdate] = useState({});
    const { showBoundary } = useErrorBoundary();

    const handleSubmit = useCallback(
        async (userInput: string) => {
            challenge.setStatus("evaluating");
            forceUpdate({});
            const response = await challenge.checkComprehension(userInput);
            console.log(response);

            if (response) {
                if (response.valid) {
                    challenge.setStatus("correct");
                } else {
                    challenge.setStatus("incorrect");
                    // challenge.playAudio();
                }

                forceUpdate({});
            }
        },
        [challenge]
    );

    const generateProblem = useCallback(async () => {
        setPlaybackStatus("loading");

        try {
            const success = await challenge.generateProblem();
            if (success) {
                setPlaybackStatus("playing");
                await challenge.playAudio();
                setPlaybackStatus("finished");
            }
        } catch (error) {
            const provider = AIProviderRegistry.getActiveProvider("tts");
            showBoundary(`Failed to perform Text-to-Speech with ${provider.name}.\n\n${error.message}`);
        }
    }, [challenge, showBoundary]);

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
            {challenge.status === "correct" || challenge.status === "incorrect" ? (
                <TrainerFeedback
                    playbackStatus={playbackStatus}
                    message={
                        <div>
                            Here's what the AI had to say about your response:
                            <br />
                            <small>
                                {challenge.comprehensionResponse?.explanation}
                            </small>
                        </div>
                    }
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
