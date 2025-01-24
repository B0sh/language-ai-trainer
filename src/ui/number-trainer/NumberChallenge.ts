export interface NumberChallengeState {
    currentNumber: number;
    status: NumberChallengeStatus;
    streak: number;
}

export type NumberChallengeStatus =
    | "waiting"
    | "audio-loading"
    | "audio-playing"
    | "audio-finished"
    | "correct"
    | "incorrect";

export const generateNumber = (): number => {
    return Math.floor(Math.random() * 1000) + 1;
};

export const checkAnswer = (challenge: number, answer: string): boolean => {
    const parsedAnswer = parseInt(answer, 10);
    return !isNaN(parsedAnswer) && parsedAnswer === challenge;
};
