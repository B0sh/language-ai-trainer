import * as React from "react";
import { useEffect, useRef } from "react";
import SlSpinner from "@shoelace-style/shoelace/dist/react/spinner";
import SlIcon from "@shoelace-style/shoelace/dist/react/icon";
import { LLMChatMessage } from "../../../ai/interfaces";
import { ConversationAnalysis } from "../../../ai/prompts/conversation-prompts";

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
                return <Message key={index} message={message} index={index} analysis={analysis} />;
            })}
            {playbackStatus === "loading" && (
                <div className="message ai">
                    <div className="message-content">
                        <SlSpinner className="large-spinner" />
                    </div>
                </div>
            )}
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
}

const Message: React.FC<MessageProps> = ({ message, index, analysis }) => {
    if (analysis) {
        const corrections = analysis.corrections?.filter((c) => c.messageIndex === index);

        if (corrections?.length > 0) {
            return (
                <>
                    <div className={`message ${message.role}`}>
                        <div className="message-content">{message.content}</div>
                    </div>

                    {corrections.map((correction, index) => (
                        <React.Fragment key={index}>
                            <div key={index} className="message correction">
                                <div className="message-content">{correction.suggestedText}</div>
                            </div>
                            <div key={index} className="message explanation">
                                <small>
                                    <SlIcon name="info-circle" /> {correction.explanation}
                                </small>
                            </div>
                        </React.Fragment>
                    ))}
                </>
            );
        }
    }

    return (
        <div className={`message ${message.role}`}>
            <div className="message-content">{message.content}</div>
        </div>
    );
};
