import React, { useEffect } from "react";
import SlButton from "@shoelace-style/shoelace/dist/react/button";
import SlAlert from "@shoelace-style/shoelace/dist/react/alert";
import { NumberChallengeState } from "./NumberChallenge";

interface NumberTrainerFeedbackProps {
    state: NumberChallengeState;
    onReplayAudio: () => void;
    onNextRound: () => void;
}

export const NumberTrainerFeedback: React.FC<NumberTrainerFeedbackProps> = ({ state, onReplayAudio, onNextRound }) => {
    useEffect(() => {
        let timeout: NodeJS.Timeout;
        if (state.status === "correct") {
            timeout = setTimeout(() => {
                onNextRound();
            }, 3000);
        }
        return () => clearTimeout(timeout);
    }, [state.status, onNextRound]);

    return (
        <div className="feedback-container" style={{ marginTop: "1rem", textAlign: "center" }}>
            {state.status === "correct" ? (
                <SlAlert variant="success" open>
                    <h3>Correct! ✅</h3>
                    The number was: {state.currentNumber}
                </SlAlert>
            ) : (
                <SlAlert variant="danger" open>
                    <h3>Incorrect ❌</h3>
                    The correct number was {state.currentNumber}.
                    <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
                        <SlButton variant="primary" onClick={onReplayAudio}>
                            Replay Audio
                        </SlButton>
                    </div>
                </SlAlert>
            )}
        </div>
    );
};
