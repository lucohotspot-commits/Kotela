
"use client";

export type Score = {
  score: number;
  date: string;
};

export type Wallet = {
  id: string;
  networkName: string;
  address: string;
  balance: number;
}

export type Withdrawal = {
  id: string;
  amount: number;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  paymentMethod: {
    type: string;
    [key: string]: any;
  }
};

const SCORES_KEY = "kotela-scores";
const CURRENCY_KEY = "kotela-currency";
const INVENTORY_KEY = "kotela-inventory";
const WITHDRAWALS_KEY = "kotela-withdrawals";
const WALLETS_KEY = "kotela-wallets";
const MAX_WALLETS = 3;


const generateRandomAddress = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let address = '0x';
    for (let i = 0; i < 40; i++) {
        address += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return address;
};

// === Wallet Management ===
export function getWallets(): Wallet[] {
    if (typeof window === "undefined") return [];
    try {
        const walletsJSON = localStorage.getItem(WALLETS_KEY);
        if (walletsJSON) {
            return JSON.parse(walletsJSON) as Wallet[];
        } else {
            // Create a default wallet if none exists
            const defaultWallet: Wallet = {
                id: 'default-ktc-wallet',
                networkName: 'Kotela',
                address: generateRandomAddress(),
                balance: getCurrency() // Sync with main currency balance
            };
            localStorage.setItem(WALLETS_KEY, JSON.stringify([defaultWallet]));
            return [defaultWallet];
        }
    } catch (error) {
        console.error("Failed to retrieve wallets:", error);
        return [];
    }
}

export function addWallet(networkName: string): void {
    if (typeof window === "undefined") return;
    try {
        const currentWallets = getWallets();
        if (currentWallets.length >= MAX_WALLETS) {
            console.warn("Maximum number of wallets reached.");
            return;
        }
        const newWallet: Wallet = {
            id: new Date().toISOString() + Math.random().toString(),
            networkName,
            address: generateRandomAddress(),
            balance: 0
        };
        const updatedWallets = [...currentWallets, newWallet];
        localStorage.setItem(WALLETS_KEY, JSON.stringify(updatedWallets));
        window.dispatchEvent(new Event('storage'));
    } catch (error) {
        console.error("Failed to add wallet:", error);
    }
}

export function deleteWallet(walletId: string): void {
    if (typeof window === "undefined") return;
    try {
        const currentWallets = getWallets();
        const updatedWallets = currentWallets.filter(w => w.id !== walletId);
        localStorage.setItem(WALLETS_KEY, JSON.stringify(updatedWallets));
        window.dispatchEvent(new Event('storage'));
    } catch (error) {
        console.error("Failed to delete wallet:", error);
    }
}

function syncDefaultWalletBalance(totalCurrency: number): void {
    if (typeof window === "undefined") return;
    try {
        const wallets = getWallets();
        const defaultWalletIndex = wallets.findIndex(w => w.id === 'default-ktc-wallet');
        if (defaultWalletIndex !== -1) {
            wallets[defaultWalletIndex].balance = totalCurrency;
            localStorage.setItem(WALLETS_KEY, JSON.stringify(wallets));
        }
    } catch (error) {
        console.error("Failed to sync default wallet balance:", error);
    }
}


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
    return currency ? parseFloat(currency) : 1000; // Start with 1000 coins
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
    const newTotal = currentCurrency + amount;
    localStorage.setItem(CURRENCY_KEY, newTotal.toString());
    syncDefaultWalletBalance(newTotal);
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
      const newTotal = currentCurrency - amount;
      localStorage.setItem(CURRENCY_KEY, newTotal.toString());
      syncDefaultWalletBalance(newTotal);
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

// === Withdrawal Management ===
export function getWithdrawals(): Withdrawal[] {
  if (typeof window === "undefined") return [];
  try {
    const withdrawalsJSON = localStorage.getItem(WITHDRAWALS_KEY);
    if (withdrawalsJSON) {
      const withdrawals = JSON.parse(withdrawalsJSON) as Withdrawal[];
      return withdrawals.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
    return [];
  } catch (error) {
    console.error("Failed to retrieve withdrawals:", error);
    return [];
  }
}

export function addWithdrawal(withdrawal: Omit<Withdrawal, 'id'>): void {
  if (typeof window === "undefined") return;
  try {
    const currentWithdrawals = getWithdrawals();
    const newWithdrawal: Withdrawal = {
      ...withdrawal,
      id: new Date().toISOString() + Math.random().toString(),
    };
    const updatedWithdrawals = [newWithdrawal, ...currentWithdrawals];
    localStorage.setItem(WITHDRAWALS_KEY, JSON.stringify(updatedWithdrawals));
  } catch (error) {
    console.error("Failed to save withdrawal:", error);
  }
}
