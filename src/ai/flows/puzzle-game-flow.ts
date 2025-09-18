
'use server';
/**
 * @fileOverview An AI agent for a puzzle game.
 * 
 * - getPuzzle - A function that generates a puzzle and a prize for solving it.
 * - verifyPuzzleAnswer - A function that verifies a user's answer.
 * - Puzzle - The output type for the getPuzzle function.
 * - VerifyPuzzleAnswerInput - The input type for the verifyPuzzleAnswer function.
 * - VerifyPuzzleAnswerOutput - The return type for the verifyPuzzleAnswer function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const PuzzleSchema = z.object({
    puzzle: z.string().describe('A 10x10 grid of letters forming a word search puzzle. The grid should be a single string with newline characters separating rows.'),
    answer: z.string().describe('A comma-separated string of the words hidden in the puzzle.'),
    prize: z.number().describe('The number of coins awarded for solving the puzzle.'),
    difficulty: z.enum(['easy', 'medium', 'hard']).describe('The difficulty of the puzzle.'),
});
export type Puzzle = z.infer<typeof PuzzleSchema>;

const VerifyPuzzleAnswerInputSchema = z.object({
    puzzle: z.string().describe('The original puzzle that was asked.'),
    correctAnswer: z.string().describe('The correct answer to the puzzle.'),
    userAnswer: z.string().describe("The user's provided answer."),
});
export type VerifyPuzzleAnswerInput = z.infer<typeof VerifyPuzzleAnswerInputSchema>;

const VerifyPuzzleAnswerOutputSchema = z.object({
    isCorrect: z.boolean().describe("Whether the user's answer is correct."),
    explanation: z.string().describe("A brief explanation of the puzzle's answer."),
});
export type VerifyPuzzleAnswerOutput = z.infer<typeof VerifyPuzzleAnswerOutputSchema>;


export async function getPuzzle(): Promise<Puzzle> {
    return getPuzzleFlow();
}

export async function verifyPuzzleAnswer(input: VerifyPuzzleAnswerInput): Promise<VerifyPuzzleAnswerOutput> {
    return verifyPuzzleAnswerFlow(input);
}


const puzzlePrompt = ai.definePrompt({
    name: 'getPuzzlePrompt',
    output: { schema: PuzzleSchema },
    prompt: `You are a Word Search Wizard. Generate a single, themed word search puzzle for a game.
    
    1.  **Theme:** Pick a random, fun theme (e.g., "Space," "Fruits," "Animals," "Programming Terms").
    2.  **Grid:** Create a 10x10 grid of uppercase letters.
    3.  **Words:** Hide 5 to 7 words related to the theme within the grid. Words can be placed horizontally, vertically, or diagonally, forwards or backwards.
    4.  **Output:**
        -   puzzle: The 10x10 grid as a single string, with each row separated by a newline character. Also include the list of words to find below the grid, under a "Words to Find:" heading.
        -   answer: A single, comma-separated string of the hidden words.
        -   difficulty: Rate the difficulty (easy, medium, or hard) based on the obscurity and placement of the words.
        -   prize: Award a prize between 100 and 1000 coins based on the difficulty.`,
});

const getPuzzleFlow = ai.defineFlow(
    {
        name: 'getPuzzleFlow',
        outputSchema: PuzzleSchema,
    },
    async () => {
        const { output } = await puzzlePrompt();
        return output!;
    }
);


const verificationPrompt = ai.definePrompt({
    name: 'verifyPuzzleAnswerPrompt',
    input: { schema: VerifyPuzzleAnswerInputSchema },
    output: { schema: VerifyPuzzleAnswerOutputSchema },
    prompt: `You are the judge of a word search puzzle game. The user was given a puzzle and a list of correct words.

    Correct Words (as a comma-separated string): {{{correctAnswer}}}
  
    The user provided this answer (their found words, likely also comma-separated):
    User's Answer: {{{userAnswer}}}
  
    Determine if the user's answer is correct. The user is considered correct if they find **at least 80%** of the hidden words. The order of words does not matter, and minor spelling mistakes can be tolerated.
    
    - If they are correct, set 'isCorrect' to true and provide an 'explanation' congratulating them and listing all the correct words.
    - If they are incorrect, set 'isCorrect' to false and provide an 'explanation' that gently tells them they didn't find enough words, then list all the correct words.`,
});
  
const verifyPuzzleAnswerFlow = ai.defineFlow(
    {
        name: 'verifyPuzzleAnswerFlow',
        inputSchema: VerifyPuzzleAnswerInputSchema,
        outputSchema: VerifyPuzzleAnswerOutputSchema,
    },
    async (input) => {
        const { output } = await verificationPrompt(input);
        return output!;
    }
);
