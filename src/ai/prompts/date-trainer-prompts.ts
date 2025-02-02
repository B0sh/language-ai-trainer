import { LLMRequest } from "../interfaces";
import { TargetLanguageLevel } from "../../models/app-settings";

export const PROMPT_DATE_TRAINER_SENTENCE = function (
    language: string,
    languageLevel: TargetLanguageLevel,
    dateFormatted: string,
    inspirationWord: string
): LLMRequest {
    let levelClause = "";

    if (languageLevel === "low") {
        levelClause = `The text should be understandable for beginner learners of ${language}.`;
    }
    if (languageLevel === "medium") {
        levelClause = `The text should be understandable for non native speakers of ${language}.`;
    }

    return {
        prompt: `Generate a sentence that uses the date "${dateFormatted}" in the ${language} language. The sentence should be about "${inspirationWord}". You do not have to use this word in the sentence. Use the character set appropriate for the ${language} language. Only return the text of the sentences. ${levelClause}

Do not include any other text except for the generated sentence.
Do not include any translations.`,
        temperature: 0.5,
    };
};
