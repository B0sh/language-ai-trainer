import React, { useCallback, useEffect, useState } from "react";
import { DateChallenge, DateChallengeRoundConfig } from "./DateChallenge";
import { DateTrainerRound } from "./DateTrainerRound";
import { TrainerFeedback } from "../shared/Trainer/TrainerFeedback";
import { AppSettings } from "../../models/app-settings";
import { AIProviderRegistry } from "../../ai/registry";
import { useErrorBoundary } from "react-error-boundary";

interface DateTrainerActivityProps {
    settings: AppSettings;
    config: DateChallengeRoundConfig;
}

export const DateTrainerActivity: React.FC<DateTrainerActivityProps> = ({ settings, config }) => {
    const [challenge] = useState(
        () =>
            new DateChallenge(
                config,
                settings.targetLanguage,
                settings.targetLanguageLevel,
                settings.dateTrainerGenSentence
            )
    );
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
                challenge.playAudio(settings.volume);
            }
            forceUpdate({});
        },
        [challenge]
    );

    const speakDate = useCallback(async () => {
        setPlaybackStatus("loading");
        if (challenge.loading) return;

        try {
            await challenge.generateSentence();
        } catch (error) {
            const provider = AIProviderRegistry.getActiveProvider("llm");
            showBoundary(`Failed to request LLM with ${provider.name}.\n\n${error.message}`);
            return;
        }

        try {
            await challenge.generateAudio();
            setPlaybackStatus("playing");
            await challenge.playAudio(settings.volume);
            setPlaybackStatus("finished");
        } catch (error) {
            const provider = AIProviderRegistry.getActiveProvider("tts");
            showBoundary(`Failed to perform Text-to-Speech with ${provider.name}.\n\n${error.message}`);
        }
    }, [challenge, showBoundary]);

    useEffect(() => {
        speakDate();
        return () => {
            challenge.stopAudio();
        };
    }, [challenge, speakDate]);

    const handleNextRound = useCallback(() => {
        challenge.nextRound();
        speakDate();
        forceUpdate({});
    }, [challenge, speakDate]);

    const replayAudio = useCallback(() => {
        challenge.playAudio(settings.volume);
    }, [challenge]);

    return (
        <>
            {challenge.status === "correct" || challenge.status === "incorrect" ? (
                <TrainerFeedback
                    playbackStatus={playbackStatus}
                    statusMessage={<div>The date was {challenge.displayAnswer()}. </div>}
                    message={challenge.sentenceMode ? challenge.round.sentence : null}
                    status={challenge.status}
                    onNextRound={handleNextRound}
                    onReplayAudio={replayAudio}
                />
            ) : (
                <DateTrainerRound
                    settings={settings}
                    playbackStatus={playbackStatus}
                    status={challenge.status}
                    round={challenge.round}
                    onSubmit={handleSubmit}
                />
            )}
        </>
    );
};
