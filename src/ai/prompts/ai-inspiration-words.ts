import { TargetLanguageLevel } from "../../models/app-settings";
import { getRandomElement } from "../../shared/utility";
import enWordList from "./data/ai-inspiration-words.txt";
import n5WordList from "./data/ja-JP/n5.json";
import n4WordList from "./data/ja-JP/n4.json";
import n3WordList from "./data/ja-JP/n3.json";
import n2WordList from "./data/ja-JP/n2.json";
import n1WordList from "./data/ja-JP/n1.json";

export function generateAIInspirationWord(language: string, level: TargetLanguageLevel): string {
    let words: string[];
    switch (language) {
        case "ja-JP":
            switch (level) {
                case "low":
                    words = n5WordList.words;
                    break;
                case "medium":
                    words = n4WordList.words;
                    break;
                case "high":
                    words = [...n3WordList.words, ...n2WordList.words, ...n1WordList.words];
                    break;
            }
            break;
        default:
            words = enWordList.split("\n");
            break;
    }

    return getRandomElement(words);
}
