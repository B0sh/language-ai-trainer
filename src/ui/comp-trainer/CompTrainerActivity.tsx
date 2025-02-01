import React, { useCallback, useEffect, useState } from "react";
import { TrainerFeedback } from "../shared/Trainer/TrainerFeedback";
import { AppSettings } from "../../models/app-settings";
import { AIProviderRegistry } from "../../ai/registry";
import { CompChallenge } from "./CompChallenge";
import { CompTrainerRound } from "./CompTrainerRound";
import { useErrorBoundary } from "react-error-boundary";

interface Props {
    settings: AppSettings;
}

export const CompTrainerActivity: React.FC<Props> = ({ settings }) => {
    const [challenge] = useState(() => new CompChallenge(settings.targetLanguage, settings.targetLanguageLevel));
    const [playbackStatus, setPlaybackStatus] = useState<string>("");
    const [, forceUpdate] = useState({});
    const { showBoundary } = useErrorBoundary();

    const handleSubmit = useCallback(
        async (userInput: string) => {
            challenge.setStatus("evaluating");
            forceUpdate({});

            try {
                const response = await challenge.checkComprehension(userInput);

                if (response) {
                    if (response.valid) {
                        challenge.setStatus("correct");
                    } else {
                        challenge.setStatus("incorrect");
                        // challenge.playAudio(settings.volume);
                    }

                    forceUpdate({});
                }
            } catch (error) {
                const provider = AIProviderRegistry.getActiveProvider("llm");
                showBoundary(`Failed to request LLM with ${provider.name}.\n\n${error.message}`);
            }
        },
        [challenge]
    );

    const generateProblem = useCallback(async () => {
        setPlaybackStatus("loading");

        let success = false;
        try {
            success = await challenge.generateProblem();
        } catch (error) {
            const provider = AIProviderRegistry.getActiveProvider("llm");
            showBoundary(`Failed to request LLM with ${provider.name}.\n\n${error.message}`);
        }

        if (!success) {
            return;
        }

        try {
            success = await challenge.generateProblemAudio();
            if (success) {
                setPlaybackStatus("playing");
                await challenge.playAudio(settings.volume);
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
                    statusMessage={
                        <div>
                            Here's what the AI had to say about your response:
                            <br />
                            <small>{challenge.comprehensionResponse?.explanation}</small>
                        </div>
                    }
                    message={challenge.storyText}
                    status={challenge.status}
                    onNextRound={handleNextRound}
                    onReplayAudio={generateProblem}
                />
            ) : (
                <CompTrainerRound playbackStatus={playbackStatus} status={challenge.status} onSubmit={handleSubmit} />
            )}
        </>
    );
};
