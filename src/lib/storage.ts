"use client";

export type Score = {
  score: number;
  date: string;
};

const STORAGE_KEY = "kotela-scores";

export function getScores(): Score[] {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const scoresJSON = localStorage.getItem(STORAGE_KEY);
    if (scoresJSON) {
      const scores = JSON.parse(scoresJSON) as Score[];
      return scores.sort((a, b) => b.score - a.score);
    }
    return [];
  } catch (error) {
    console.error("Failed to retrieve scores from local storage:", error);
    return [];
  }
}

export function addScore(score: number): Score[] {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const currentScores = getScores();
    const newScore: Score = {
      score,
      date: new Date().toISOString(),
    };
    const updatedScores = [...currentScores, newScore].sort(
      (a, b) => b.score - a.score
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedScores));
    return updatedScores;
  } catch (error) {
    console.error("Failed to save score to local storage:", error);
    return getScores();
  }
}
