import React, { useCallback, useEffect, useState } from "react";
import { NumberChallenge, NumberChallengeRoundConfig } from "./NumberChallenge";
import { NumberTrainerRound } from "./NumberTrainerRound";
import { TrainerFeedback } from "../shared/Trainer/TrainerFeedback";
import SlFormatNumber from "@shoelace-style/shoelace/dist/react/format-number";
import { AppSettings } from "../../models/app-settings";
import { AIProviderRegistry } from "../../ai/registry";
import { useErrorBoundary } from "react-error-boundary";

interface NumberTrainerActivityProps {
    settings: AppSettings;
    config: NumberChallengeRoundConfig;
    onStop: () => void;
}

export const NumberTrainerActivity: React.FC<NumberTrainerActivityProps> = ({ settings, config, onStop }) => {
    const [challenge] = useState(() => new NumberChallenge(config));
    const [playbackStatus, setPlaybackStatus] = useState<string>("");
    const [, forceUpdate] = useState({});
    const { showBoundary } = useErrorBoundary();

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
            showBoundary(`Failed to perform Text-to-Speech with ${provider.name}.\n\n${error.message}`);
        }
    }, [challenge, settings.targetLanguage, showBoundary]);

    useEffect(() => {
        speakNumber();
    }, [speakNumber]);

    const handleNextRound = useCallback(() => {
        challenge.nextRound();
        speakNumber();
        forceUpdate({});
    }, [challenge]);

    const replayAudio = () => {
        challenge.playAudio();
    };

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
                    onReplayAudio={replayAudio}
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
