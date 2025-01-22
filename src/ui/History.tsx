import React, { useEffect, useRef, useState } from 'react';
import type { CorrectionMessage } from '../models/openai-message';
import './History.css';

interface HistoryProps {
    messages: CorrectionMessage[];
}

export const History: React.FC<HistoryProps> = ({ messages }) => {
    const divRef = useRef<HTMLDivElement>(null);
    const [autoscroll, setAutoscroll] = useState(false);

    useEffect(() => {
        const handleBeforeUpdate = () => {
            if (divRef.current) {
                const scrollableDistance = divRef.current.scrollHeight - divRef.current.offsetHeight;
                setAutoscroll(divRef.current.scrollTop > scrollableDistance - 20);
            }
        };

        handleBeforeUpdate();
    });

    useEffect(() => {
        if (autoscroll && divRef.current) {
            divRef.current.scrollTo(0, divRef.current.scrollHeight);
        }
    });

    const toggleCorrection = (index: number) => {
        const updatedMessages = [...messages];
        updatedMessages[index].showCorrection = !updatedMessages[index].showCorrection;
        // Assuming you have a way to update the messages state
    };

    return (
        <div className="container">
            <div className="phone">
                <div className="chat" ref={divRef}>
                    <header>
                        <h1>&nbsp;</h1>
                    </header>
                    {messages.map((message, index) => (
                        <React.Fragment key={index}>
                            {message.role === 'assistant' ? (
                                <article className="assistant">
                                    <div className="message">{message.content}</div>
                                </article>
                            ) : (
                                <article className="user">
                                    {message.showCorrection ? (
                                        <>
                                            <div className="message strike-through">{message.content}</div>
                                            <div className="message corrected">{message.correctedText}</div>
                                            {message.notes && <div className="notes">{message.notes}</div>}
                                        </>
                                    ) : (
                                        <div className="message">{message.content}</div>
                                    )}
                                    <div className="correction-button">
                                        {message.correctedText && (
                                            <button className="toggle-button" onClick={() => toggleCorrection(index)}>
                                                {message.showCorrection ? '修正を隠す' : '修正を表示する'}
                                            </button>
                                        )}
                                    </div>
                                </article>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
};
