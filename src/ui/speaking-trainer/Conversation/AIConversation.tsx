import * as React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { AppSettings } from "../../../models/app-settings";
import { getTargetLanguage } from "../../../shared/languages";
import { MessageInput } from "./MessageInput";
import type SlTextareaElement from "@shoelace-style/shoelace/dist/components/textarea/textarea";
import "./AIConversation.css";
import SlSpinner from "@shoelace-style/shoelace/dist/react/spinner";
import { ConversationChallenge } from "./ConversationChallenge";
import { AIProviderRegistry } from "../../../ai/registry";
import { useErrorBoundary } from "react-error-boundary";
import { LLMChatMessage } from "../../../ai/interfaces";
import { ConversationAnalysis } from "../../../ai/prompts/conversation-prompts";
import { Messages } from "./Messages";
import { ConversationPrompt } from "./ConversationPrompt";

interface Props {
    settings: AppSettings;
}

export const AIConversation: React.FC<Props> = ({ settings }) => {
    const [conversation] = useState(
        () => new ConversationChallenge(settings.targetLanguage, settings.targetLanguageLevel)
    );
    const [messages, setMessages] = useState<LLMChatMessage[]>([]);
    const [analysis, setAnalysis] = useState<ConversationAnalysis | null>(null);
    const [playbackStatus, setPlaybackStatus] = useState<string>("");
    const [, forceUpdate] = useState({});
    const { showBoundary } = useErrorBoundary();

    const textareaRef = useRef<SlTextareaElement>(null);
    const targetLanguage = getTargetLanguage(settings.targetLanguage);

    const handleSubmit = useCallback(
        async (message: string) => {
            setPlaybackStatus("loading");
            if (conversation.loading) return;

            const nextMessage: LLMChatMessage = {
                role: "user",
                content: message,
            };

            setMessages((prev) => [...prev, nextMessage]);

            try {
                const result = await conversation.submitMessage(nextMessage);
                setMessages((prev) => [...prev, result]);
            } catch (error) {
                const provider = AIProviderRegistry.getActiveProvider("llm");
                showBoundary(`Failed to request LLM with ${provider.name}.\n\n${error.message}`);
                return;
            }

            try {
                await conversation.generateAudio();
                setPlaybackStatus("playing");
                await conversation.playAudio(settings.volume);
                setPlaybackStatus("finished");
            } catch (error) {
                const provider = AIProviderRegistry.getActiveProvider("tts");
                showBoundary(`Failed to perform Text-to-Speech with ${provider.name}.\n\n${error.message}`);
            }

            setTimeout(() => {
                textareaRef.current?.focus();
            }, 100);
        },
        [conversation]
    );

    const handleFinish = useCallback(async () => {
        setPlaybackStatus("loading");
        const analysis = await conversation.generateAnalysis();
        setPlaybackStatus("finished");
        setAnalysis(analysis);
    }, [conversation]);

    return (
        <div className={`chat-container ${messages.length === 0 ? "empty" : ""}`}>
            {messages.length === 0 ? (
                <ConversationPrompt
                    inspirationWord={conversation.inspirationWord}
                    targetLanguageDescription={targetLanguage.description}
                />
            ) : (
                <Messages messages={messages} playbackStatus={playbackStatus} analysis={analysis} />
            )}
            <MessageInput
                onSubmit={handleSubmit}
                onFinish={messages.length > 0 && handleFinish}
                isLoading={conversation.loading}
                textareaRef={textareaRef}
            />
        </div>
    );
};
