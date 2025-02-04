import * as React from "react";
import { useEffect, useRef, useState } from "react";
import SlSpinner from "@shoelace-style/shoelace/dist/react/spinner";
import SlIcon from "@shoelace-style/shoelace/dist/react/icon";
import SlIconButton from "@shoelace-style/shoelace/dist/react/icon-button";
import SlTooltip from "@shoelace-style/shoelace/dist/react/tooltip";
import { LLMChatMessage } from "../../../ai/interfaces";
import { ConversationAnalysis } from "../../../ai/prompts/conversation-prompts";
import { CorrectionDialog } from "./CorrectionDialog";
import { TypewriterEffect } from "../../shared/TypewriterEffect";

interface Props {
    messages: LLMChatMessage[];
    playbackStatus: string;
    analysis: ConversationAnalysis | null;
}

export const Messages: React.FC<Props> = ({ messages, playbackStatus, analysis }) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div className="messages-container">
            {messages.map((message, index) => {
                return (
                    <Message
                        key={index}
                        message={message}
                        index={index}
                        analysis={analysis}
                        typewriterAnimation={message.role === "assistant" && messages.length - 1 === index}
                    />
                );
            })}
            {playbackStatus === "loading_chat" && <SlSpinner style={{ fontSize: "1.5rem" }} />}
            {analysis && analysis.noFeedback && (
                <div className="no-feedback-message">There was no feedback for your messages.</div>
            )}
            <div ref={messagesEndRef} />
        </div>
    );
};

interface MessageProps {
    message: LLMChatMessage;
    index: number;
    analysis: ConversationAnalysis | null;
    typewriterAnimation: boolean;
}

const Message: React.FC<MessageProps> = ({ message, index, analysis, typewriterAnimation }) => {
    const [showCorrectionModal, setShowCorrectionModal] = useState(false);

    if (analysis) {
        const corrections = analysis.corrections?.filter((c) => c.messageIndex === index);

        if (corrections?.length > 0) {
            const correction = corrections[0];
            return (
                <>
                    <div className="message correction">
                        <div className="incorrect-text">
                            <SlIcon name="x-lg" className="incorrect" />
                            {message.content}
                        </div>
                        <div className="correct-text">
                            <SlIcon name="check-lg" className="correct" />
                            {correction.suggestedText}
                        </div>
                        <div className="correction-icon">
                            <SlTooltip content={"View AI's Explanation"}>
                                <SlIconButton name="info-circle-fill" onClick={() => setShowCorrectionModal(true)} />
                            </SlTooltip>
                        </div>
                    </div>

                    <CorrectionDialog
                        open={showCorrectionModal}
                        onClose={() => setShowCorrectionModal(false)}
                        originalText={message.content}
                        correctedText={correction.suggestedText}
                        explanation={correction.explanation}
                    />
                </>
            );
        }
    }

    return (
        <div className={`message ${message.role}`}>
            <div className="message-content">
                {typewriterAnimation ? <TypewriterEffect text={message.content} /> : message.content}
            </div>
        </div>
    );
};
