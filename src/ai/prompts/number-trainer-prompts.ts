import { LLMRequest } from "../interfaces";

export const PROMPT_NUMBER_TRAINER_SENTENCE = function (
    language: string,
    number: number,
    inspirationWord: string
): LLMRequest {
    return {
        prompt: `Generate a sentence that uses the number "${number}" in the ${language} language. The sentence should be about "${inspirationWord}". You do not have to use this word in the sentence. Use the character set appropriate for the ${language} language. Only return the text of the sentences.

Do not include any other text except for the generated sentence.
Do not include any translations.`,
        temperature: 0.5,
    };
};
