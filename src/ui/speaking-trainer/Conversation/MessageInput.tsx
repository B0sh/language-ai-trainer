import * as React from "react";
import { useRef } from "react";
import { useKeypress } from "../../../shared/useKeypress";
import SlTextarea from "@shoelace-style/shoelace/dist/react/textarea";
import SlButton from "@shoelace-style/shoelace/dist/react/button";
import type SlTextareaElement from "@shoelace-style/shoelace/dist/components/textarea/textarea";

interface MessageInputProps {
    onSubmit: (message: string) => void;
    isLoading: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({ onSubmit, isLoading }) => {
    const [inputValue, setInputValue] = React.useState("");
    const textareaRef = useRef<SlTextareaElement>(null);

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!inputValue.trim() || isLoading) return;

        onSubmit(inputValue);
        setInputValue("");
    };

    useKeypress("Enter", (event: KeyboardEvent) => {
        if (document.activeElement !== textareaRef.current) return;

        if (event.shiftKey) {
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
                    value={inputValue}
                    onInput={(e) => setInputValue((e.target as HTMLTextAreaElement).value)}
                    rows={1}
                    disabled={isLoading}
                    ref={textareaRef}
                />
                <SlButton type="submit" variant="primary" disabled={isLoading || !inputValue.trim()}>
                    Send
                </SlButton>
            </form>
        </div>
    );
};
