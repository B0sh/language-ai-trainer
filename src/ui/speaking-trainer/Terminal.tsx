import React, { useEffect, useState } from "react";
import type {
    CorrectionMessage,
    OpenAIMessageRole,
} from "../../models/openai-message";
import "./Terminal.css";
import { History } from "./History";

export const Terminal: React.FC = () => {
    const [processing, setProcessing] = useState<string>("");
    const [messages, setMessages] = useState<CorrectionMessage[]>([]);

    useEffect(() => {
        // window.eel.expose(setProcessingState, 'setProcessingState');
        // window.eel.expose(setMessagesState, 'setMessages');
        // const fetchMessages = async () => {
        //     const initialMessages = await window.eel.get_messages()();
        //     setMessages(initialMessages);
        // };
        // fetchMessages();
    }, []);

    const setProcessingState = (state: string) => {
        setProcessing(state);
    };

    const setMessagesState = (_messages: CorrectionMessage[]) => {
        setMessages(_messages);
    };

    const startListening = async () => {
        setProcessingState("聞いている");
        // const newMessages = await window.eel.start_listening()();
        // setMessages(newMessages);

        // const lastMessage = newMessages[newMessages.length - 1].content;

        // setProcessingState('音声化中…');

        // const utterance = new SpeechSynthesisUtterance(lastMessage);
        // utterance.lang = 'ja-JP';
        // window.speechSynthesis.speak(utterance);

        // setProcessingState('');
    };

    const fakeMessage = () => {
        let role: OpenAIMessageRole = "assistant";
        if (
            messages.length === 0 ||
            messages[messages.length - 1].role === "assistant"
        ) {
            role = "user";
        }

        setMessages([
            ...messages,
            { role: role, content: `${messages.length} 回目のメッセージ` },
        ]);
    };

    return (
        <div className="content">
            <History messages={messages} />
            <div className="actions">
                <button onClick={fakeMessage}> 偽る </button>
                <button onClick={startListening} disabled={processing !== ""}>
                    {processing || "話す"}
                </button>
            </div>
        </div>
    );
};
