#!/usr/bin/env ts-node

import { LlamaProvider } from "../src/ai/llama/LlamaProvider";
import * as fs from "fs";

const llama = new LlamaProvider({
    model: "llama3.2:latest",
    // model: "phi4:latest",
});

function promptForWord(word: string[]) {
    const prompt = `I want create a list of words for a word game. The word be a english language word, and it should not be any type of proper noun, such as a person's name, place name, company, or brand. The word should not be primarly used for grammar, such as "the" or "a".The word should be a noun. The players of the game have varying levels of english skill, so exclude any words that are too difficult for them.

Please respond in JSON format. The JSON format is as follows:
{
    "compatible": string[],
}
Is any of the following words compatible with my criteria?
        
${word.join(", ")}`;
    return prompt;
}

function updateProgress(current: number, total: number, startTime: number, desc: string) {
    const percent = Math.floor((current / total) * 100);
    const elapsed = (Date.now() - startTime) / 1000;
    const rate = current / elapsed;
    const remaining = (total - current) / rate;

    const width = 30;
    const filled = Math.floor(width * (current / total));
    const empty = width - filled;
    const bar = "█".repeat(filled) + "░".repeat(empty);

    //clear screen
    process.stdout.write("\u001b[2J\u001b[0;0H");

    process.stdout.write(`\r[${bar}] ${percent}% | ${current}/${total} | ETA: ${remaining.toFixed(0)}s`);
    process.stdout.write(`\n  valid words: ${desc}`);

    if (current === total) {
        process.stdout.write("\n");
    }
}

async function processBatch(wordsBatch: string[]) {
    const prompt = promptForWord(wordsBatch);

    const llmResult = await llama.llm({
        prompt,
        temperature: 0,
        format: "json",
    });

    try {
        const response = JSON.parse(llmResult.response);
        // console.log(response);

        if (response.compatible) {
            // make sure that output words were in the original set
            return wordsBatch.filter((word) => response.compatible.includes(word));
        }
        return [];
    } catch (error) {
        console.log(error);
        return [];
    }
}

async function main() {
    try {
        const fileName = `${__dirname}/google-10000-english-usa-no-swears.txt`;
        const fileContent = await fs.promises.readFile(fileName, "utf-8");

        const words = fileContent.split("\n");
        const validWords: string[] = [];
        const startTime = Date.now();
        const batchSize = 20;
        const wordsBatch: string[] = [];

        let count = 0;
        for (const word of words) {
            count++;
            wordsBatch.push(word);

            if (wordsBatch.length === batchSize) {
                // Process the batch of words
                const batchResult = await processBatch(wordsBatch);
                validWords.push(...batchResult);
                updateProgress(count, words.length, startTime, batchResult.join(", "));
                wordsBatch.length = 0; // Clear the batch
            }
        }

        // Process any remaining words in the last batch
        if (wordsBatch.length > 0) {
            const batchResult = await processBatch(wordsBatch);
            validWords.push(...batchResult);
            updateProgress(wordsBatch.length, words.length, startTime, batchResult.join(", "));
        }

        fs.writeFileSync(`${__dirname}/ai-inspiration-words.txt`, validWords.join("\n"));

        console.log("\nValid words saved to ai-inspiration-words.txt");
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
}

// Run the script
main().catch(console.error);
