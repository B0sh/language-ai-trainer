import React, { useCallback, useEffect, useState } from "react";
import SlButton from "@shoelace-style/shoelace/dist/react/button";
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
    const [state, setState] = useState<NumberChallengeState>({
        currentNumber: generateNumber(),
        status: "waiting",
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
        setStatus("audio-loading");
        setTtsAudio(null);
        try {
            const ttsRequest: TTSRequest = {
                text: state.currentNumber.toString(),
                language: targetLanguage,
            };

            const result = await AIProviderRegistry.textToSpeech(ttsRequest);
            if (result) {
                setStatus("audio-playing");
                await result.play();
                setStatus("audio-finished");
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
            status: "waiting",
            streak: prev.streak + 1,
        }));
    }, []);

    const replayAudio = useCallback(() => {
        // later
    }, []);

    return (
        <>
            {state.status === "correct" || state.status === "incorrect" ? (
                <NumberTrainerFeedback
                    state={state}
                    onReplayAudio={() => replayAudio()}
                    onNextRound={handleNextRound}
                />
            ) : (
                <NumberTrainerRound targetLanguage={targetLanguage} state={state} onSubmit={handleSubmit} />
            )}

            {/* <a href="" onClick={onStop}>
                End Trainer
            </a> */}
        </>
    );
};
