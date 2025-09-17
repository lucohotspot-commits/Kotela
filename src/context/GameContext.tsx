
"use client";

import { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { addScore, getScores, getCurrency, getInventory, useBoost as consumeBoost, type Score } from '@/lib/storage';
import { checkForPrivacyIssues } from "@/app/actions";

const BASE_GAME_DURATION = 30; // 30 seconds

type GameState = "idle" | "playing" | "ended";
type Boost = "rocket" | "missile" | null;
type ActiveBoostEffect = 'scoreMultiplier' | 'frenzy' | 'timeFreeze' | null;

interface GameContextType {
  // State
  score: number;
  timeLeft: number;
  gameState: GameState;
  privacyWarning: string | null;
  isModalOpen: boolean;
  activeBoost: Boost;
  boostTimeLeft: number;
  timeBoostUsed: boolean;
  activeEffect: ActiveBoostEffect;
  gameDuration: number;
  scores: Score[];
  currency: number;
  inventory: { [key: string]: number };
  isStoreOpen: boolean;

  // Derived State
  scoreIncrement: number;

  // Functions
  handleTap: () => void;
  resetGame: () => void;
  activateBoost: (boostType: 'rocket' | 'missile') => void;
  activateEffectBoost: (boostType: 'frenzy' | 'freezeTime') => void;
  activateInstantBoost: (boostType: 'scoreBomb') => void;
  activateTimeBoost: () => void;
  setIsModalOpen: (isOpen: boolean) => void;
  refreshData: () => void;
  setIsStoreOpen: (isOpen: boolean) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [score, setScore] = useState(0);
  const [gameDuration, setGameDuration] = useState(BASE_GAME_DURATION);
  const [timeLeft, setTimeLeft] = useState(gameDuration);
  const [gameState, setGameState] = useState<GameState>("idle");
  const [privacyWarning, setPrivacyWarning] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeBoost, setActiveBoost] = useState<Boost>(null);
  const [boostTimeLeft, setBoostTimeLeft] = useState(0);
  const [timeBoostUsed, setTimeBoostUsed] = useState(false);
  const [activeEffect, setActiveEffect] = useState<ActiveBoostEffect>(null);

  const [scores, setScores] = useState<Score[]>([]);
  const [currency, setCurrency] = useState(0);
  const [inventory, setInventory] = useState<{ [key: string]: number }>({});
  const [isStoreOpen, setIsStoreOpen] = useState(false);

  const refreshData = useCallback(() => {
    setScores(getScores());
    setCurrency(getCurrency());
    setInventory(getInventory());
  }, []);

  useEffect(() => {
    refreshData();
     window.addEventListener('storage', refreshData);
    return () => {
      window.removeEventListener('storage', refreshData);
    };
  }, [refreshData]);

  const scoreIncrement = useMemo(() => {
    if (activeBoost === 'rocket') return 2;
    if (activeBoost === 'missile') return 3;
    return 1;
  }, [activeBoost]);

  useEffect(() => {
    if (gameState !== 'playing') return;

    let scoreInterval: NodeJS.Timeout;

    if (activeEffect === 'frenzy') {
      scoreInterval = setInterval(() => {
        setScore(s => s + 5 * scoreIncrement);
      }, 100);
    } else {
        scoreInterval = setInterval(() => {
            setScore(s => s + scoreIncrement);
        }, 1000);
    }

    return () => clearInterval(scoreInterval);
  }, [gameState, scoreIncrement, activeEffect]);

  const handleTap = useCallback(() => {
    if (gameState === "idle") {
      setGameState("playing");
      if (timeBoostUsed) {
        setTimeLeft(gameDuration);
      }
    }
  }, [gameState, timeBoostUsed, gameDuration]);

  useEffect(() => {
    if (gameState !== "playing" || activeEffect === 'timeFreeze') return;

    if (timeLeft <= 0) {
      setGameState("ended");
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [gameState, timeLeft, activeEffect]);
  
  useEffect(() => {
    if (activeEffect && boostTimeLeft > 0 && gameState === 'playing') {
      const boostTimerId = setInterval(() => {
        setBoostTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(boostTimerId);
    } else if (activeEffect && boostTimeLeft <= 0) {
      setActiveBoost(null);
      setActiveEffect(null);
    }
  }, [activeEffect, boostTimeLeft, gameState]);

  useEffect(() => {
    if (gameState === "ended") {
      addScore(score);
      refreshData();
      setActiveBoost(null);
      setBoostTimeLeft(0);
      setActiveEffect(null);

      const gameData = JSON.stringify({
        finalScore: score,
        gameEndTime: new Date().toISOString(),
      });

      checkForPrivacyIssues(gameData).then((warning) => {
        if (warning) {
          setPrivacyWarning(warning);
          setIsModalOpen(true);
        }
      });
    }
  }, [gameState, score, refreshData]);

  const useBoost = (boostType: string) => {
    if ((inventory[boostType] || 0) > 0) {
      consumeBoost(boostType);
      refreshData();
      return true;
    }
    return false;
  };

  const activateBoost = (boostType: 'rocket' | 'missile') => {
    if (gameState === 'playing' && !activeEffect && useBoost(boostType)) {
      setActiveBoost(boostType);
      setActiveEffect('scoreMultiplier');
      setBoostTimeLeft(boostType === 'rocket' ? 5 : 3);
    }
  }

  const activateEffectBoost = (boostType: 'frenzy' | 'freezeTime') => {
    if (gameState === 'playing' && !activeEffect && useBoost(boostType)) {
      setActiveEffect(boostType);
      setBoostTimeLeft(boostType === 'frenzy' ? 3 : 5);
    }
  };
  
  const activateInstantBoost = (boostType: 'scoreBomb') => {
    if (gameState === 'playing' && useBoost(boostType)) {
      if (boostType === 'scoreBomb') {
        setScore(s => s + 1000);
      }
    }
  };

  const activateTimeBoost = () => {
    if (gameState === 'idle' && !timeBoostUsed && useBoost('extraTime')) {
      const newDuration = BASE_GAME_DURATION + 10;
      setGameDuration(newDuration);
      setTimeLeft(newDuration);
      setTimeBoostUsed(true);
    }
  };

  const resetGame = () => {
    setScore(0);
    setGameDuration(BASE_GAME_DURATION);
    setTimeLeft(BASE_GAME_DURATION);
    setGameState("idle");
    setPrivacyWarning(null);
    setActiveBoost(null);
    setBoostTimeLeft(0);
    setTimeBoostUsed(false);
    setActiveEffect(null);
  };

  const value = {
    score,
    timeLeft,
    gameState,
    privacyWarning,
    isModalOpen,
    activeBoost,
    boostTimeLeft,
    timeBoostUsed,
    activeEffect,
    gameDuration,
    scores,
    currency,
    inventory,
    isStoreOpen,
    scoreIncrement,
    handleTap,
    resetGame,
    activateBoost,
    activateEffectBoost,
    activateInstantBoost,
    activateTimeBoost,
    setIsModalOpen,
    refreshData,
    setIsStoreOpen,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
