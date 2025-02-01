import React, { useRef } from "react";
import SlTextarea from "@shoelace-style/shoelace/dist/react/textarea";
import SlSpinner from "@shoelace-style/shoelace/dist/react/spinner";
import SlIcon from "@shoelace-style/shoelace/dist/react/icon";
import SlButton from "@shoelace-style/shoelace/dist/react/button";
import type SlTextareaElement from "@shoelace-style/shoelace/dist/components/textarea/textarea";

interface Props {
    playbackStatus: string;
    status: string;
    onSubmit: (input: string) => void;
}

export const CompTrainerRound: React.FC<Props> = ({ playbackStatus, status, onSubmit }) => {
    const inputRef = useRef<SlTextareaElement>(null);

    if (playbackStatus === "loading" || status === "evaluating") {
        return <SlSpinner className="large-spinner" />;
    }

    inputRef.current?.focus();

    return (
        <div className="comp-trainer-round">
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    onSubmit(inputRef.current?.value);
                    return false;
                }}
            >
                <SlTextarea
                    ref={inputRef}
                    className="trainer-input"
                    size="large"
                    autoFocus
                    rows={2}
                    autocomplete="off"
                    autoCorrect="off"
                    disabled={status === "correct" || status === "incorrect" ? true : false}
                />

                <br />
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <div>Write a summary of what was said.</div>
                    <div>
                        <SlButton type="submit" variant="primary" pill>
                            <SlIcon slot="prefix" name="book" />
                            Next Problem
                        </SlButton>
                    </div>
                </div>
            </form>
        </div>
    );
};
