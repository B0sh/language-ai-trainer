import React, { useRef } from "react";
import SlTextarea from "@shoelace-style/shoelace/dist/react/textarea";
import SlSpinner from "@shoelace-style/shoelace/dist/react/spinner";
import type SlTextareaElement from "@shoelace-style/shoelace/dist/components/textarea/textarea";
import { useKeypress } from "../../shared/useKeypress";

interface Props {
    playbackStatus: string;
    status: string;
    onSubmit: (input: string) => void;
}

export const CompTrainerRound: React.FC<Props> = ({ playbackStatus, status, onSubmit }) => {
    const inputRef = useRef<SlTextareaElement>(null);

    useKeypress("Enter", (event: KeyboardEvent) => {
        if (document.activeElement !== inputRef.current) return;

        if (event.shiftKey || event.isComposing) {
            // Let the default behavior handle new line
            return;
        } else {
            event.preventDefault();
            onSubmit(inputRef.current?.value);
        }
    });

    inputRef.current?.focus();

    if (playbackStatus === "loading" || status === "evaluating") {
        return <SlSpinner className="large-spinner" />;
    }

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
                    helpText="Write a summary of what was said."
                    disabled={status === "correct" || status === "incorrect" ? true : false}
                />
            </form>
        </div>
    );
};
