import React, { useRef } from "react";
import SlInput from "@shoelace-style/shoelace/dist/react/input";
import SlSpinner from "@shoelace-style/shoelace/dist/react/spinner";
import SlIcon from "@shoelace-style/shoelace/dist/react/icon";
import type SlInputElement from "@shoelace-style/shoelace/dist/components/input/input";

interface DateTrainerRoundProps {
    playbackStatus: string;
    status: string;
    streak: number;
    onSubmit: (input: string) => void;
}

export const DateTrainerRound: React.FC<DateTrainerRoundProps> = ({ playbackStatus, status, streak, onSubmit }) => {
    const inputRef = useRef<SlInputElement>(null);

    const getStatusIcon = () => {
        if (playbackStatus === "loading") {
            return <SlSpinner style={{ fontSize: "2rem" }} />;
        }

        return <SlIcon style={{ fontSize: "2rem" }} name="soundwave" />;
    };

    const handleInputChange = (event: Event) => {
        const input = event.target as HTMLInputElement;
        const value = input.value.replace(/[^\d]/g, "");
        if (value) {
            // if I want to support over 1b, need to figure out an alt solution here
            const number = parseInt(value, 10);
            input.value = number.toLocaleString();
        }
    };

    inputRef.current?.focus();

    return (
        <>
            <div className="number-trainer-input-row">
                <div className="status-icon">{getStatusIcon()}</div>
                <SlInput
                    ref={inputRef}
                    pill
                    className="trainer-input"
                    size="large"
                    autoFocus
                    autocomplete="off"
                    autoCorrect="off"
                    maxlength={12}
                    disabled={status === "correct" || status === "incorrect" ? true : false}
                    onKeyDown={(e) =>
                        e.key === "Enter" && onSubmit((e.target as HTMLInputElement).value.replace(/,/g, ""))
                    }
                    onSlInput={handleInputChange}
                />
            </div>

            <div className="stats">
                Your streak is <strong>{streak}</strong>.
            </div>
        </>
    );
};
