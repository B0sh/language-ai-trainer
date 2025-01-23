export interface NumberChallengeState {
    currentNumber: number;
    status: "waiting" | "audio-playing" | "audio-finished" | "correct" | "incorrect";
    attempts: number;
}

export const generateNumber = (): number => {
    return Math.floor(Math.random() * 1000) + 1;
};

export const checkAnswer = (challenge: number, answer: string): boolean => {
    const parsedAnswer = parseInt(answer, 10);
    return !isNaN(parsedAnswer) && parsedAnswer === challenge;
};
