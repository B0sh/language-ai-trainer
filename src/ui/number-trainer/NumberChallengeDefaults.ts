import { NumberChallengeRoundConfig } from "./NumberChallenge";

export const NUMBER_CHALLENGE_DEFAULT_DIFFICULTY: NumberChallengeRoundConfig[] = [
    {
        label: "Easy",
        helpText: "Generates numbers up up to 99",
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
        helpText: "Generates numbers up to 10,000",
        generators: [
            {
                type: "random",
                weight: 30,
                min: 100,
                max: 99999,
            },
            {
                type: "random",
                weight: 20,
                min: 100,
                max: 9999,
                multiplier: 10,
            },
            {
                type: "random",
                weight: 20,
                min: 10,
                max: 999,
                multiplier: 100,
            },
        ],
    },
    {
        label: "Hard",
        helpText: "Generates numbers with 3 significant digits up to 1 billion",
        generators: [
            {
                type: "random",
                weight: 1,
                min: 1,
                max: 999,
            },
            {
                type: "random",
                weight: 1,
                min: 1,
                max: 999,
                multiplier: 10,
            },
            {
                type: "random",
                weight: 1,
                min: 1,
                max: 999,
                multiplier: 100,
            },
            {
                type: "random",
                weight: 1,
                min: 1,
                max: 999,
                multiplier: 1000,
            },
            {
                type: "random",
                weight: 1,
                min: 1,
                max: 999,
                multiplier: 10000,
            },
            {
                type: "random",
                weight: 1,
                min: 1,
                max: 999,
                multiplier: 100000,
            },
            {
                type: "random",
                weight: 1,
                min: 1,
                max: 999,
                multiplier: 1000000,
            },
        ],
    },
    {
        label: "Very Hard",
        helpText: "Completely random numbers up to 1 billion",
        generators: [
            {
                type: "random",
                weight: 10,
                min: 1,
                max: 1000000000,
            },
        ],
    },
];
