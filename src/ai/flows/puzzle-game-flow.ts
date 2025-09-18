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
    puzzle: z.string().describe('A challenging but solvable puzzle, riddle, or logic problem.'),
    answer: z.string().describe('The correct answer to the puzzle.'),
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
    prompt: `You are a master of puzzles and riddles. Generate a single, clever puzzle for a game. 
    It can be a riddle, a logic problem, or a word puzzle.
    Provide the puzzle itself, the correct answer, a difficulty rating (easy, medium, or hard),
    and determine a fair prize in coins for solving it. Easy puzzles should be worth 50-150 coins,
    medium 200-400, and hard 500-1000. Be creative!`,
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
    prompt: `You are the judge of a puzzle game. The user was given the following puzzle:
  
    Puzzle: {{{puzzle}}}
    Correct Answer: {{{correctAnswer}}}
  
    The user provided this answer:
    User's Answer: {{{userAnswer}}}
  
    Determine if the user's answer is correct. Be very lenient with phrasing and minor spelling mistakes, but the core concept must be right.
    
    Provide a boolean for 'isCorrect' and a brief 'explanation' of the correct answer.`,
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
