"use server";

import { analyzeGameDataForPrivacy } from "@/ai/flows/analyze-game-data-for-privacy";

export async function checkForPrivacyIssues(gameData: string): Promise<string> {
  // Generate a random, non-persistent ID for the AI check
  const sessionId = `session_${Math.random().toString(36).substring(2, 15)}`;

  try {
    const result = await analyzeGameDataForPrivacy({
      gameData,
      userId: sessionId,
    });
    return result.privacyWarning;
  } catch (error) {
    console.error("AI analysis failed:", error);
    // In case of an error, we don't want to block the user. 
    // We will return an empty string and log the error.
    return "";
  }
}
