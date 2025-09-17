'use server';
/**
 * @fileOverview Analyzes game data for potential privacy concerns using an LLM.
 *
 * - analyzeGameDataForPrivacy - A function that analyzes game data and warns if personal information could be inferred.
 * - AnalyzeGameDataInput - The input type for the analyzeGameDataForPrivacy function.
 * - AnalyzeGameDataOutput - The return type for the analyzeGameDataForPrivacy function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeGameDataInputSchema = z.object({
  gameData: z.string().describe('The game data to analyze.'),
  userId: z.string().describe('The user ID associated with the game data.'),
});
export type AnalyzeGameDataInput = z.infer<typeof AnalyzeGameDataInputSchema>;

const AnalyzeGameDataOutputSchema = z.object({
  privacyWarning: z
    .string()
    .describe(
      'A warning message if personal information could be inferred from the game data, otherwise an empty string.'
    ),
});
export type AnalyzeGameDataOutput = z.infer<typeof AnalyzeGameDataOutputSchema>;

export async function analyzeGameDataForPrivacy(
  input: AnalyzeGameDataInput
): Promise<AnalyzeGameDataOutput> {
  return analyzeGameDataForPrivacyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeGameDataPrompt',
  input: {schema: AnalyzeGameDataInputSchema},
  output: {schema: AnalyzeGameDataOutputSchema},
  prompt: `You are a privacy expert analyzing game data for potential personal information leaks.

  Analyze the following game data associated with user ID {{{userId}}} and determine if any personal information could be inferred from it.

  Game Data: {{{gameData}}}

  If personal information could be inferred, provide a warning message explaining the potential privacy risks. Otherwise, return an empty string for the privacyWarning field.

  Ensure the privacyWarning field is concise and easy to understand for the average user.
  `,
});

const analyzeGameDataForPrivacyFlow = ai.defineFlow(
  {
    name: 'analyzeGameDataForPrivacyFlow',
    inputSchema: AnalyzeGameDataInputSchema,
    outputSchema: AnalyzeGameDataOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
