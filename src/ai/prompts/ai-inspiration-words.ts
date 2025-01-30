import { getRandomElement } from "../../shared/utility";
import words from "./ai-inspiration-words.txt";

export function generateAIInspirationWord(): string {
    return getRandomElement(words.split("\n"));
}
