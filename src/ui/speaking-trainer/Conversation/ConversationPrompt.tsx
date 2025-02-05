import * as React from "react";
import SlDialog from "@shoelace-style/shoelace/dist/react/dialog";
import SlInput from "@shoelace-style/shoelace/dist/react/input";
import SlButton from "@shoelace-style/shoelace/dist/react/button";
import SlTooltip from "@shoelace-style/shoelace/dist/react/tooltip";
import SlIconButton from "@shoelace-style/shoelace/dist/react/icon-button";
import type SlInputElement from "@shoelace-style/shoelace/dist/components/input/input";
import { AppSettings } from "../../../models/app-settings";
import { getTargetLanguage } from "../../../shared/languages";
import { generateAIInspirationWord } from "../../../ai/prompts/ai-inspiration-words";

interface Props {
    inspirationWord: string;
    settings: AppSettings;
    onCustomWordSelect?: (word: string) => void;
}

export const ConversationPrompt: React.FC<Props> = ({ inspirationWord, settings, onCustomWordSelect }) => {
    const [open, setOpen] = React.useState(false);
    const [customWord, setCustomWord] = React.useState(inspirationWord);

    const handleSubmit = () => {
        if (customWord.trim() && onCustomWordSelect) {
            onCustomWordSelect(customWord.trim());
            setOpen(false);
            setCustomWord("");
        }
    };

    const randomizeWord = () => {
        const word = generateAIInspirationWord(settings.targetLanguage, settings.targetLanguageLevel);
        setCustomWord(word);
    };

    const onHide = (event: Event) => {
        if ((event.target as Element).tagName === "SL-DIALOG") {
            setOpen(false);
        }
    };

    return (
        <div className="prompt-container">
            Start a conversation about the word "{inspirationWord}" in{" "}
            {getTargetLanguage(settings.targetLanguage).description}.
            {onCustomWordSelect && (
                <SlButton size="small" variant="text" onClick={() => setOpen(true)} style={{ marginLeft: "0.5rem" }}>
                    Change Word
                </SlButton>
            )}
            <SlDialog label="Choose Custom Word" open={open} onSlAfterHide={onHide}>
                <div className="conversation-prompt-dialog">
                    <SlInput
                        placeholder="Enter a custom word"
                        value={customWord}
                        onSlInput={(e) => setCustomWord((e.target as SlInputElement).value)}
                    />

                    <SlTooltip content="Randomize Word">
                        <SlIconButton name="arrow-clockwise" onClick={() => randomizeWord()}></SlIconButton>
                    </SlTooltip>
                </div>
                <div slot="footer">
                    <SlButton variant="text" onClick={() => setOpen(false)}>
                        Cancel
                    </SlButton>
                    <SlButton variant="primary" onClick={handleSubmit}>
                        Use Word
                    </SlButton>
                </div>
            </SlDialog>
        </div>
    );
};
