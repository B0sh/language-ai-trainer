import React, { useState, useEffect } from "react";

interface Props {
    text: string;
}

export const TypewriterEffect: React.FC<Props> = ({ text }) => {
    const [display, setDisplay] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        setDisplay("");
        setCurrentIndex(0);
    }, [text]);

    useEffect(() => {
        if (currentIndex < text.length) {
            const timeout = setTimeout(() => {
                setDisplay((prev) => prev + text[currentIndex]);
                setCurrentIndex((prev) => prev + 1);
            }, 50);

            return () => clearTimeout(timeout);
        }
    }, [text, currentIndex]);

    return <>{display}</>;
};
