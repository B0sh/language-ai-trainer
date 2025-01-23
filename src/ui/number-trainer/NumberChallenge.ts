export interface NumberChallengeState {
    currentNumber: number;
    userInput: string;
    status: "waiting" | "speaking" | "listening" | "correct" | "incorrect";
    attempts: number;
    correctAttempts: number;
}

export const generateNumber = (): number => {
    return Math.floor(Math.random() * 1000) + 1;
};

export const checkAnswer = (challenge: number, answer: string): boolean => {
    const parsedAnswer = parseInt(answer, 10);
    return !isNaN(parsedAnswer) && parsedAnswer === challenge;
};
