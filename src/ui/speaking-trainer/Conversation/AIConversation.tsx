import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { AppSettings } from "../../../models/app-settings";
import { getTargetLanguage } from "../../../shared/languages";
import { MessageInput } from "./MessageInput";
import "./AIConversation.css";

interface Message {
    role: "user" | "assistant";
    content: string;
}

interface AIConversationProps {
    settings: AppSettings;
}

export const AIConversation: React.FC<AIConversationProps> = ({ settings }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const targetLanguage = getTargetLanguage(settings.targetLanguage);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (message: string) => {
        const newMessage: Message = {
            role: "user",
            content: message,
        };

        setMessages((prev) => [...prev, newMessage]);
        setIsLoading(true);

        // TODO: Implement AI response
        // For now, we'll just simulate a response
        setTimeout(() => {
            const aiResponse: Message = {
                role: "assistant",
                content: "This is a placeholder response. The AI integration will be implemented later.",
            };
            setMessages((prev) => [...prev, aiResponse]);
            setIsLoading(false);
        }, 1000);
    };

    return (
        <div className={`chat-container ${messages.length === 0 ? "empty" : ""}`}>
            {messages.length === 0 && (
                <div className="prompt-container">
                    Start a conversation about a random word in {targetLanguage.description}
                </div>
            )}
            {messages.length > 0 && (
                <div className="messages-container">
                    {messages.map((message, index) => (
                        <div key={index} className={`message ${message.role}`}>
                            <div className="message-content">{message.content}</div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            )}
            <MessageInput onSubmit={handleSubmit} isLoading={isLoading} />
        </div>
    );
};
