import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { AppSettings } from "../../../models/app-settings";
import { getTargetLanguage } from "../../../shared/languages";
import { MessageInput } from "./MessageInput";
import type SlTextareaElement from "@shoelace-style/shoelace/dist/components/textarea/textarea";
import "./AIConversation.css";
import { AIProviderRegistry } from "../../../ai/registry";
import { LLMChatMessage, LLMChatRequest } from "../../../ai/interfaces";

interface Props {
    settings: AppSettings;
}

export const AIConversation: React.FC<Props> = ({ settings }) => {
    const [messages, setMessages] = useState<LLMChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<SlTextareaElement>(null);
    const targetLanguage = getTargetLanguage(settings.targetLanguage);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (message: string) => {
        const newMessage: LLMChatMessage = {
            role: "user",
            content: message,
        };

        setMessages((prev) => [...prev, newMessage]);
        setIsLoading(true);

        try {
            const chatRequest: LLMChatRequest = {
                messages: [
                    {
                        role: "system",
                        content: `You are a friendly conversation partner helping someone practice ${targetLanguage.description}. 
                                Respond naturally and conversationally, keeping responses concise and engaging. 
                                If the user makes language mistakes, provide gentle corrections while maintaining the flow of conversation.`,
                    },
                    ...messages,
                    newMessage,
                ],
            };

            const result = await AIProviderRegistry.llmChat(chatRequest);
            setMessages((prev) => [...prev, result.response]);
        } catch (error) {
            // Add an error message to the conversation
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: `I apologize, but I encountered an error: ${error.message}. Please try again.`,
                },
            ]);
        } finally {
            setIsLoading(false);
            setTimeout(() => {
                textareaRef.current?.focus();
            }, 100);
        }
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
            <MessageInput onSubmit={handleSubmit} isLoading={isLoading} textareaRef={textareaRef} />
        </div>
    );
};
