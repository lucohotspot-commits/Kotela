
"use client";

export type Score = {
  score: number;
  date: string;
};

const SCORES_KEY = "kotela-scores";
const CURRENCY_KEY = "kotela-currency";
const INVENTORY_KEY = "kotela-inventory";

// === Score Management ===
export function getScores(): Score[] {
  if (typeof window === "undefined") return [];
  try {
    const scoresJSON = localStorage.getItem(SCORES_KEY);
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
  if (typeof window === "undefined") return [];
  try {
    const currentScores = getScores();
    const newScore: Score = {
      score,
      date: new Date().toISOString(),
    };
    const updatedScores = [...currentScores, newScore].sort(
      (a, b) => b.score - a.score
    );
    localStorage.setItem(SCORES_KEY, JSON.stringify(updatedScores));
    
    // Add score to currency
    addCurrency(score);

    return updatedScores;
  } catch (error) {
    console.error("Failed to save score to local storage:", error);
    return getScores();
  }
}

// === Currency Management ===
export function getCurrency(): number {
  if (typeof window === "undefined") return 0;
  try {
    const currency = localStorage.getItem(CURRENCY_KEY);
    return currency ? parseFloat(currency) : 0;
  } catch (error)
    {
    console.error("Failed to get currency:", error);
    return 0;
  }
}

export function addCurrency(amount: number) {
  if (typeof window === "undefined") return;
  try {
    const currentCurrency = getCurrency();
    localStorage.setItem(CURRENCY_KEY, (currentCurrency + amount).toString());
    window.dispatchEvent(new Event('storage'));
  } catch (error) {
    console.error("Failed to add currency:", error);
  }
}

export function spendCurrency(amount: number): boolean {
  if (typeof window === "undefined") return false;
  try {
    const currentCurrency = getCurrency();
    if (currentCurrency >= amount) {
      localStorage.setItem(CURRENCY_KEY, (currentCurrency - amount).toString());
      window.dispatchEvent(new Event('storage'));
      return true;
    }
    return false;
  } catch (error) {
    console.error("Failed to spend currency:", error);
    return false;
  }
}


// === Inventory Management ===
export function getInventory(): { [key: string]: number } {
  if (typeof window === "undefined") return {};
  try {
    const inventoryJSON = localStorage.getItem(INVENTORY_KEY);
    return inventoryJSON ? JSON.parse(inventoryJSON) : {};
  } catch (error) {
    console.error("Failed to get inventory:", error);
    return {};
  }
}

export function addBoost(boostId: string, quantity: number): void {
  if (typeof window === "undefined") return;
  try {
    const inventory = getInventory();
    inventory[boostId] = (inventory[boostId] || 0) + quantity;
    localStorage.setItem(INVENTORY_KEY, JSON.stringify(inventory));
  } catch (error) {
    console.error("Failed to add boost:", error);
  }
}

export function useBoost(boostId: string): boolean {
    if (typeof window === "undefined") return false;
    try {
        const inventory = getInventory();
        if (inventory[boostId] && inventory[boostId] > 0) {
            inventory[boostId] -= 1;
            localStorage.setItem(INVENTORY_KEY, JSON.stringify(inventory));
            return true;
        }
        return false;
    } catch (error) {
        console.error("Failed to use boost:", error);
        return false;
    }
}
