import React, { useEffect } from "react";
import SlButton from "@shoelace-style/shoelace/dist/react/button";
import SlAlert from "@shoelace-style/shoelace/dist/react/alert";
import SlIcon from "@shoelace-style/shoelace/dist/react/icon";
import { NumberChallengeState } from "./NumberChallenge";

interface NumberTrainerFeedbackProps {
    playbackStatus: string;
    state: NumberChallengeState;
    onReplayAudio: () => void;
    onNextRound: () => void;
}

export const NumberTrainerFeedback: React.FC<NumberTrainerFeedbackProps> = ({
    playbackStatus,
    state,
    onReplayAudio,
    onNextRound,
}) => {
    useEffect(() => {
        let timeout: NodeJS.Timeout;
        if (state.status === "correct") {
            timeout = setTimeout(() => {
                onNextRound();
            }, 3000);
            return () => clearTimeout(timeout);
        }

        if (state.status === "incorrect") {
            onReplayAudio();
        }
    }, []);

    return (
        <div className="feedback-container">
            {state.status === "correct" ? (
                <SlAlert variant="success" open>
                    <SlIcon slot="icon" name="check-circle-fill" />
                    <h3>Correct!</h3>
                    The number was {state.currentNumber}.
                </SlAlert>
            ) : (
                <>
                    <SlAlert variant="danger" open>
                        <SlIcon slot="icon" name="x-circle-fill" />
                        <h3>Incorrect</h3>
                        The number was {state.currentNumber}.
                    </SlAlert>

                    <br />

                    <SlButton variant="neutral" onClick={onReplayAudio} disabled={playbackStatus === "playing"}>
                        Replay Audio
                    </SlButton>

                    <SlButton variant="primary" onClick={onNextRound}>
                        Restart
                    </SlButton>
                </>
            )}
        </div>
    );
};
