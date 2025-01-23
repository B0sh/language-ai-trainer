import React, { useCallback, useEffect, useState } from "react";
import SlInput from "@shoelace-style/shoelace/dist/react/input";
import SlSpinner from "@shoelace-style/shoelace/dist/react/spinner";
import SlIcon from "@shoelace-style/shoelace/dist/react/icon";
import { AIProviderRegistry } from "../../ai/registry";
import { NumberChallengeState } from "./NumberChallenge";
import { TTSRequest } from "../../ai/interfaces";

interface NumberTrainerRoundProps {
    state: NumberChallengeState;
    onSubmit: (input: string) => void;
}

export const NumberTrainerRound: React.FC<NumberTrainerRoundProps> = ({ state, onSubmit }) => {
    const [numberInput, setNumberInput] = useState("");
    const [speakState, setSpeakState] = useState<"idle" | "loading" | "speaking">("idle");

    const speakNumber = useCallback(async () => {
        setSpeakState("loading");
        try {
            const ttsRequest: TTSRequest = {
                text: state.currentNumber.toString(),
                language: "ja-JP",
            };

            const result = await AIProviderRegistry.textToSpeech(ttsRequest);
            if (result) {
                setSpeakState("speaking");
                await result.play();
                setSpeakState("idle");
            }
        } catch (error) {
            console.error("Failed to speak number:", error);
            setSpeakState("idle");
        }
    }, [state.currentNumber]);

    // Play sound automatically when the round starts
    useEffect(() => {
        if (state.status === "waiting") {
            speakNumber();
        }
    }, [state.currentNumber, speakNumber]);

    const getStatusIcon = () => {
        switch (speakState) {
            case "loading":
                return <SlSpinner style={{ fontSize: "2rem" }} />;
            case "speaking":
                return <SlIcon style={{ fontSize: "2rem" }} name="soundwave" />;
            case "idle":
                return <SlIcon style={{ fontSize: "2rem" }} name="soundwave" />;
            default:
                return null;
        }
    };

    return (
        <div className="number-trainer-input-row">
            {/* <SlButton variant="primary" onClick={speakNumber}>
                Repeat Number
            </SlButton> */}
            <div className="status-icon">{getStatusIcon()}</div>
            <SlInput
                pill
                className="number-trainer-input"
                size="large"
                value={numberInput}
                autoFocus
                autocomplete="off"
                autoCorrect="off"
                onSlChange={(e) => setNumberInput((e.target as HTMLInputElement).value)}
                onKeyDown={(e) => e.key === "Enter" && onSubmit((e.target as HTMLInputElement).value)}
            />
        </div>
    );
};
