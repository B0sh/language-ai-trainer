import * as React from "react";
import { useKeypress } from "../../../shared/useKeypress";
import SlTextarea from "@shoelace-style/shoelace/dist/react/textarea";
import SlButton from "@shoelace-style/shoelace/dist/react/button";
import SlIcon from "@shoelace-style/shoelace/dist/react/icon";
import type SlTextareaElement from "@shoelace-style/shoelace/dist/components/textarea/textarea";

interface MessageInputProps {
    onSubmit: (message: string) => void;
    textareaRef: React.RefObject<SlTextareaElement>;
    isLoading: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({ onSubmit, textareaRef, isLoading }) => {
    const [inputValue, setInputValue] = React.useState("");

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!inputValue.trim() || isLoading) return;

        onSubmit(inputValue);
        setInputValue("");
    };

    useKeypress("Enter", (event: KeyboardEvent) => {
        if (document.activeElement !== textareaRef.current) return;

        if (event.shiftKey || event.isComposing) {
            // Let the default behavior handle new line
            return;
        } else {
            event.preventDefault();
            handleSubmit();
        }
    });

    return (
        <div className="input-container">
            <form onSubmit={handleSubmit} className="input-form">
                <SlTextarea
                    className="input-textarea"
                    resize="auto"
                    autoFocus={true}
                    value={inputValue}
                    onInput={(e) => setInputValue((e.target as HTMLTextAreaElement).value)}
                    rows={1}
                    placeholder="Type your message..."
                    ref={textareaRef}
                />
                <SlButton pill type="submit" variant="primary">
                    <SlIcon slot="prefix" name="stopwatch-fill" />
                    Finish
                </SlButton>
            </form>
        </div>
    );
};
