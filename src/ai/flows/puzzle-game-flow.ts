
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
    puzzle: z.string().describe('A single, clever riddle or clue.'),
    answer: z.string().describe('A single word that is the answer to the riddle.'),
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
    explanation: z.string().describe("A brief explanation of why the user's answer is correct or incorrect."),
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
    prompt: `You are a Riddle Master. Generate a single, clever riddle or word puzzle for a game.

    1.  **Riddle:** Create a riddle whose answer is a single word.
    2.  **Difficulty:** Choose a random difficulty (easy, medium, or hard).
    3.  **Output:**
        -   puzzle: The riddle itself.
        -   answer: The single-word answer.
        -   difficulty: Rate the difficulty.
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
    prompt: `You are the judge of a riddle game.

    The user was given this riddle:
    "{{{puzzle}}}"
  
    The correct answer is: "{{{correctAnswer}}}"
  
    The user guessed: "{{{userAnswer}}}"
  
    Determine if the user's answer is correct. Be lenient with capitalization but strict on the word itself.
    - If correct, set 'isCorrect' to true and provide a brief congratulatory 'explanation'.
    - If incorrect, set 'isCorrect' to false and provide a brief 'explanation' that states the correct answer.`,
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
