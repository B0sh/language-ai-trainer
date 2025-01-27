import { LLMRequest } from "../interfaces";

export const PROMPT_COMP_SENTENCE = function (language: string): LLMRequest {
    return {
        prompt: `Generate a few sentences in the ${language} language. Use the character set appropriate for the ${language} language. Only return the text of the sentences.

Do not include any other text except for the generated sentences.
Do not include any translations.`,
        temperature: 0.5,
    };
};

export const PROMPT_COMP_VALIDATE = function (language: string, sentence: string, input: string): LLMRequest {
    return {
        prompt: `Given the following sentences in ${language}:
${sentence}

Does the following statement show that the user had some comprehension of the above text? The statement may be brief and does not need to be very detailed. The statement may also be in a single sentence. The statement is:
${input}

Repsond using JSON format. The JSON format is as follows:
{
    "valid": boolean,
    "explanation": string
}`,
        temperature: 0,
        format: "json",
    };
};
