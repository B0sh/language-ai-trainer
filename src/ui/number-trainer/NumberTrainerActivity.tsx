import React, { useCallback, useEffect, useState } from "react";
import { NumberChallengeState, generateNumber, checkAnswer, NumberChallengeStatus } from "./NumberChallenge";
import { NumberTrainerRound } from "./NumberTrainerRound";
import { NumberTrainerFeedback } from "./NumberTrainerFeedback";
import { TTSAudio, TTSRequest } from "../../ai/interfaces";
import { AIProviderRegistry } from "../../ai/registry";

interface NumberTrainerActivityProps {
    targetLanguage: string;
    onStop: () => void;
}

export const NumberTrainerActivity: React.FC<NumberTrainerActivityProps> = ({ targetLanguage, onStop }) => {
    const [ttsAudio, setTtsAudio] = useState<TTSAudio | null>(null);
    const [playbackStatus, setPlaybackStatus] = useState<string>("");
    const [state, setState] = useState<NumberChallengeState>({
        currentNumber: generateNumber(),
        status: "active",
        streak: 0,
    });

    const setStatus = (status: NumberChallengeStatus) => {
        setState((prev) => ({
            ...prev,
            status,
        }));
    };

    const handleSubmit = useCallback(
        (userInput: string) => {
            const isCorrect = checkAnswer(state.currentNumber, userInput);
            setStatus(isCorrect ? "correct" : "incorrect");
        },
        [state.currentNumber]
    );

    const speakNumber = useCallback(async () => {
        setTtsAudio(null);
        setPlaybackStatus("loading");
        try {
            const ttsRequest: TTSRequest = {
                text: state.currentNumber.toString(),
                language: targetLanguage,
            };

            const result = await AIProviderRegistry.textToSpeech(ttsRequest);
            if (result) {
                setPlaybackStatus("playing");
                await result.play();
                setPlaybackStatus("stopped");
                setTtsAudio(result);
            }
        } catch (error) {
            const provider = AIProviderRegistry.getActiveProvider("tts");
            throw new Error(`Failed to generate speech for API ${provider.name}.\n${error}`);
        }
    }, [state.currentNumber, targetLanguage]);

    useEffect(() => {
        speakNumber();
    }, [state.currentNumber, speakNumber]);

    const handleNextRound = useCallback(() => {
        setState((prev) => ({
            currentNumber: generateNumber(),
            status: "active",
            streak: prev.streak + 1,
        }));
    }, []);

    const replayAudio = async () => {
        if (ttsAudio) {
            setPlaybackStatus("playing");
            await ttsAudio.play();
            setPlaybackStatus("stopped");
        }
    };

    return (
        <>
            {state.status === "correct" || state.status === "incorrect" ? (
                <NumberTrainerFeedback
                    state={state}
                    playbackStatus={playbackStatus}
                    onReplayAudio={() => replayAudio()}
                    onNextRound={handleNextRound}
                />
            ) : (
                <NumberTrainerRound playbackStatus={playbackStatus} state={state} onSubmit={handleSubmit} />
            )}

            {/* <a href="" onClick={onStop}>
                End Trainer
            </a> */}
        </>
    );
};
