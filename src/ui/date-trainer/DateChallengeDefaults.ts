import { DateChallengeRoundConfig } from "./DateChallenge";

export const DATE_CHALLENGE_DEFAULT_DIFFICULTY: DateChallengeRoundConfig[] = [
    {
        label: "Easy",
        helpText: "Practice with dates from 2000-2025",
        generators: [
            {
                type: "random",
                weight: 1,
                minYear: 2000,
                maxYear: 2025,
            },
        ],
    },
    {
        label: "Medium",
        helpText: "Practice with dates from 1950-2025",
        generators: [
            {
                type: "random",
                weight: 1,
                minYear: 1950,
                maxYear: 2025,
            },
        ],
    },
    {
        label: "Hard",
        helpText: "Practice with dates from 1900-2025",
        generators: [
            {
                type: "random",
                weight: 1,
                minYear: 1900,
                maxYear: 2025,
            },
        ],
    },
];
