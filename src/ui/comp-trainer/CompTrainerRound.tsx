import React, { useRef } from "react";
import SlInput from "@shoelace-style/shoelace/dist/react/input";
import SlSpinner from "@shoelace-style/shoelace/dist/react/spinner";
import SlIcon from "@shoelace-style/shoelace/dist/react/icon";
import type SlInputElement from "@shoelace-style/shoelace/dist/components/input/input";

interface Props {
    playbackStatus: string;
    status: string;
    streak: number;
    onSubmit: (input: string) => void;
}

export const CompTrainerRound: React.FC<Props> = ({ playbackStatus, status, streak, onSubmit }) => {
    const inputRef = useRef<SlInputElement>(null);

    if (playbackStatus === "loading" || status === "evaluating") {
        return <SlSpinner className="large-spinner" />;
    }

    inputRef.current?.focus();

    return (
        <>
            <div className="number-trainer-input-row">
                <div className="status-icon">
                    <SlIcon style={{ fontSize: "2rem" }} name="soundwave" />
                </div>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        onSubmit(inputRef.current?.value);
                        return false;
                    }}
                >
                    <SlInput
                        ref={inputRef}
                        pill
                        className="trainer-input"
                        size="large"
                        autoFocus
                        autocomplete="off"
                        autoCorrect="off"
                        disabled={status === "correct" || status === "incorrect" ? true : false}
                    />
                </form>
            </div>

            <i>Give a breif summary of the spoken audio.</i>
            {/* 
            <div className="stats">
                Your streak is <strong>{streak}</strong>.
            </div> */}
        </>
    );
};
