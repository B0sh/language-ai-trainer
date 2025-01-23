import React, { useCallback, useState } from "react";
import SlButton from "@shoelace-style/shoelace/dist/react/button";
import { NumberChallengeState, generateNumber, checkAnswer } from "./NumberChallenge";
import { NumberTrainerRound } from "./NumberTrainerRound";

interface NumberTrainerActivityProps {
    onStop: () => void;
}

export const NumberTrainerActivity: React.FC<NumberTrainerActivityProps> = ({ onStop }) => {
    const [state, setState] = useState<NumberChallengeState>({
        currentNumber: generateNumber(),
        status: "waiting",
        attempts: 0,
    });

    const handleSubmit = useCallback(
        (userInput: string) => {
            const isCorrect = checkAnswer(state.currentNumber, userInput);

            if (!isCorrect) {
                setState((prev) => ({ ...prev, status: "incorrect" }));
                setTimeout(() => onStop(), 1000);
                return;
            }

            setState((prev) => ({
                currentNumber: generateNumber(),
                userInput: "",
                status: "waiting",
                attempts: prev.attempts + 1,
            }));
        },
        [state.currentNumber, onStop]
    );

    return (
        <>
            <h2>Number Trainer </h2>

            <NumberTrainerRound state={state} onSubmit={handleSubmit} />

            <div className="stats">Correct: {state.attempts}</div>
            <SlButton variant="danger" onClick={onStop}>
                Stop
            </SlButton>
        </>
    );
};
