import { NumberChallengeRoundConfig } from "./NumberChallenge";

export const NUMBER_CHALLENGE_DEFAULT_DIFFICULTY: NumberChallengeRoundConfig[] = [
    {
        label: "Easy",
        helpText: "Generate numbers up up to 99",
        generators: [
            {
                type: "random",
                weight: 1,
                min: 1,
                max: 99,
            },
        ],
    },
    {
        label: "Medium",
        helpText: "Generate numbers up to 10,000",
        generators: [
            {
                type: "random",
                weight: 10,
                min: 1,
                max: 9,
                multiplier: 10,
            },
            {
                type: "random",
                weight: 30,
                min: 1,
                max: 9,
                multiplier: 100,
            },
            {
                type: "random",
                weight: 30,
                min: 1,
                max: 10,
                multiplier: 1000,
            },
        ],
    },
    {
        label: "Hard",
        helpText: "Generate numbers with 2 significant digits up to 1 billion",
        generators: [
            {
                type: "random",
                weight: 1,
                min: 10,
                max: 99,
                multiplier: 10,
            },
            {
                type: "random",
                weight: 1,
                min: 1,
                max: 99,
                multiplier: 100,
            },
            {
                type: "random",
                weight: 1,
                min: 1,
                max: 99,
                multiplier: 100000,
            },
            {
                type: "random",
                weight: 1,
                min: 1,
                max: 99,
                multiplier: 10000000,
            },
        ],
    },
];
