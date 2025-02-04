import * as React from "react";

interface Props {
    inspirationWord: string;
    targetLanguageDescription: string;
}

export const ConversationPrompt: React.FC<Props> = ({ inspirationWord, targetLanguageDescription }) => {
    return (
        <div className="prompt-container">
            Start a conversation about the word "{inspirationWord}" in {targetLanguageDescription}
        </div>
    );
};
