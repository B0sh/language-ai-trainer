import { DateChallengeRoundConfig } from "./DateChallenge";

export const DATE_CHALLENGE_DEFAULT_DIFFICULTY: DateChallengeRoundConfig[] = [
    {
        label: "Easy",
        helpText: "Practice one date or time input",
        generators: [
            {
                format: "yyyy",
                weight: 1,
                min: new Date(1975, 0, 1),
                max: new Date(),
            },
            {
                format: "mm",
                weight: 1,
                min: new Date(1975, 0, 1),
                max: new Date(),
            },
            {
                format: "hh:mm",
                weight: 1,
                min: new Date(1975, 0, 1),
                max: new Date(),
            },
        ],
    },
    {
        label: "Medium",
        helpText: "Practice full dates from 1975",
        generators: [
            {
                format: "yyyy-mm-dd",
                weight: 1,
                min: new Date(1975, 0, 1),
                max: new Date(),
            },
            {
                format: "yyyy-mm",
                weight: 2,
                min: new Date(1975, 0, 1),
                max: new Date(),
            },
            {
                format: "mm-dd",
                weight: 2,
                min: new Date(1975, 0, 1),
                max: new Date(),
            },
        ],
    },
    {
        label: "Hard",
        helpText: "Practice with full dates and time",
        generators: [
            {
                format: "yyyy-mm-dd hh:mm",
                weight: 1,
                min: new Date(1900, 0, 1),
                max: new Date(2100, 0, 1),
            },
        ],
    },
];
