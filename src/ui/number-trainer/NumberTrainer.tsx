import React, { useCallback, useState } from "react";
import SlInput from "@shoelace-style/shoelace/dist/react/input";
import SlButton from "@shoelace-style/shoelace/dist/react/button";
import SlAlert from "@shoelace-style/shoelace/dist/react/alert";
import { AIProviderRegistry } from "../../ai/registry";
import { NumberChallengeState, generateNumber, checkAnswer } from "./NumberChallenge";
import "./NumberTrainer.css";
import { TTSRequest } from "../../ai/interfaces";

export const NumberTrainer = () => {
    const [state, setState] = useState<NumberChallengeState>({
        currentNumber: generateNumber(),
        userInput: "",
        status: "waiting",
        attempts: 0,
        correctAttempts: 0,
    });

    const speakNumber = useCallback(async () => {
        setState((prev) => ({ ...prev, status: "speaking" }));

        try {
            const ttsRequest: TTSRequest = {
                text: state.currentNumber.toString(),
                language: "ja-JP",
            };
            const result = await AIProviderRegistry.textToSpeech(ttsRequest);
            await result.play();
            setState((prev) => ({ ...prev, status: "listening" }));
        } catch (error) {
            console.error("Failed to speak number:", error);
            setState((prev) => ({ ...prev, status: "waiting" }));
        }
    }, [state.currentNumber]);

    const handleSubmit = () => {
        const isCorrect = checkAnswer(state.currentNumber, state.userInput);
        setState((prev) => ({
            ...prev,
            status: isCorrect ? "correct" : "incorrect",
            attempts: prev.attempts + 1,
            correctAttempts: isCorrect ? prev.correctAttempts + 1 : prev.correctAttempts,
        }));
    };

    const handleNext = () => {
        setState((prev) => ({
            ...prev,
            currentNumber: generateNumber(),
            userInput: "",
            status: "waiting",
        }));
    };

    const handleInputChange = (e: any) => {
        setState((prev) => ({ ...prev, userInput: e.target.value }));
    };

    const handleKeyPress = (e: any) => {
        if (e.key === "Enter" && state.userInput) {
            handleSubmit();
        }
    };

    return (
        <div className="number-trainer">
            <div className="game-container">
                <h2>Number Trainer</h2>

                <div className="stats">
                    Score: {state.correctAttempts}/{state.attempts}
                </div>

                <div className="controls">
                    <SlButton
                        variant="primary"
                        size="large"
                        onClick={speakNumber}
                        disabled={state.status === "speaking"}
                    >
                        {state.status === "speaking" ? "Speaking..." : "Speak Number"}
                    </SlButton>

                    <SlInput
                        type="number"
                        size="large"
                        pill
                        className="number-trainer-input"
                        value={state.userInput}
                        onSlInput={handleInputChange}
                        onKeyDown={handleKeyPress}
                        placeholder="Type the number you heard"
                        disabled={state.status === "speaking" || state.status === "waiting"}
                    ></SlInput>

                    <SlButton
                        variant="primary"
                        size="large"
                        onClick={handleSubmit}
                        disabled={!state.userInput || state.status === "speaking" || state.status === "waiting"}
                    >
                        Submit
                    </SlButton>
                </div>

                {(state.status === "correct" || state.status === "incorrect") && (
                    <div className="result">
                        <SlAlert variant={state.status === "correct" ? "success" : "danger"} open>
                            {state.status === "correct"
                                ? "Correct!"
                                : `Incorrect. The number was ${state.currentNumber}`}
                        </SlAlert>

                        <SlButton variant="primary" size="large" onClick={handleNext}>
                            Next Number
                        </SlButton>
                    </div>
                )}
            </div>
        </div>
    );
};
