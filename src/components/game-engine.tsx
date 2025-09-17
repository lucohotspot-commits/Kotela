"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Hand, Repeat, AlertTriangle, TimerIcon, Rocket, Bomb, Clock, Zap, Gift, Snowflake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addScore, useBoost } from "@/lib/storage";
import { checkForPrivacyIssues } from "@/app/actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const BASE_GAME_DURATION = 30; // 30 seconds

type GameState = "idle" | "playing" | "ended";
type Boost = "rocket" | "missile" | null;
type ActiveBoostEffect = 'scoreMultiplier' | 'frenzy' | 'timeFreeze' | null;

interface GameEngineProps {
  onGameEnd: () => void;
  inventory: { [key: string]: number };
  refreshInventory: () => void;
}

export function GameEngine({ onGameEnd, inventory, refreshInventory }: GameEngineProps) {
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

  const scoreIncrement = useMemo(() => {
    if (activeBoost === 'rocket') return 2;
    if (activeBoost === 'missile') return 3;
    return 1;
  }, [activeBoost]);

  // Score increment logic
  useEffect(() => {
    if (gameState !== "playing") return;

    let scoreInterval: NodeJS.Timeout;
    if (activeEffect === 'frenzy') {
      scoreInterval = setInterval(() => {
        setScore(s => s + 5 * scoreIncrement); // Frenzy taps fast!
      }, 100);
    } else {
        const tapInterval = setInterval(() => {
             // Tapping is simulated automatically
        }, 100);
        return () => clearInterval(tapInterval);
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
    if (gameState === "playing") {
      setScore((s) => s + scoreIncrement);
    }
  }, [gameState, scoreIncrement, timeBoostUsed, gameDuration]);

  // Timer logic
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
  
  // Boost timer logic
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

  // Game end logic
  useEffect(() => {
    if (gameState === "ended") {
      addScore(score);
      onGameEnd();
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
  }, [gameState, score, onGameEnd]);

  const activateBoost = (boostType: 'rocket' | 'missile') => {
    if ((inventory[boostType] || 0) > 0 && gameState === 'playing' && !activeEffect) {
      useBoost(boostType);
      setActiveBoost(boostType);
      setActiveEffect('scoreMultiplier');
      setBoostTimeLeft(boostType === 'rocket' ? 5 : 3);
      refreshInventory();
    }
  }

  const activateEffectBoost = (boostType: 'frenzy' | 'freezeTime') => {
    if ((inventory[boostType] || 0) > 0 && gameState === 'playing' && !activeEffect) {
      useBoost(boostType);
      setActiveEffect(boostType);
      setBoostTimeLeft(boostType === 'frenzy' ? 3 : 5);
      refreshInventory();
    }
  };
  
  const activateInstantBoost = (boostType: 'scoreBomb') => {
    if ((inventory[boostType] || 0) > 0 && gameState === 'playing') {
      useBoost(boostType);
      if (boostType === 'scoreBomb') {
        setScore(s => s + 1000);
      }
      refreshInventory();
    }
  };

  const activateTimeBoost = () => {
    if ((inventory.extraTime || 0) > 0 && gameState === 'idle' && !timeBoostUsed) {
      useBoost('extraTime');
      setGameDuration(BASE_GAME_DURATION + 10);
      setTimeLeft(BASE_GAME_DURATION + 10);
      setTimeBoostUsed(true);
      refreshInventory();
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

  const tapAreaText = useMemo(() => {
    if (gameState === "idle") return "Tap to Start";
    if (gameState === "ended") return "Game Over";
    if (activeEffect === 'frenzy') return "Frenzy!";
    return "Tap!";
  }, [gameState, activeEffect]);

  const CIRCLE_RADIUS = 120;
  const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;
  const progressOffset =
    CIRCLE_CIRCUMFERENCE -
    (timeLeft / gameDuration) * CIRCLE_CIRCUMFERENCE;

  const boostTextColor = useMemo(() => {
    if (activeBoost === 'rocket') return 'text-yellow-500';
    if (activeBoost === 'missile') return 'text-red-500';
    if (activeEffect === 'frenzy') return 'text-purple-500';
    if (activeEffect === 'timeFreeze') return 'text-cyan-400';
    return 'text-foreground';
  }, [activeBoost, activeEffect]);
  
  const BoostStatus = () => {
    if (!activeEffect || gameState !== 'playing') return null;
  
    let icon = null;
    let text = '';
  
    if (activeEffect === 'scoreMultiplier') {
      icon = activeBoost === 'rocket' ? <Rocket className="h-4 w-4" /> : <Bomb className="h-4 w-4" />;
      text = `${scoreIncrement}x Boost! (${boostTimeLeft}s)`;
    } else if (activeEffect === 'timeFreeze') {
      icon = <Snowflake className="h-4 w-4" />;
      text = `Time Frozen! (${boostTimeLeft}s)`;
    } else if (activeEffect === 'frenzy') {
      icon = <Zap className="h-4 w-4" />;
      text = `Frenzy! (${boostTimeLeft}s)`;
    }
  
    return (
      <span className={`flex items-center gap-1 font-bold ${boostTextColor}`}>
        {icon}
        {text}
      </span>
    );
  };


  return (
    <div className="w-full max-w-md flex flex-col items-center gap-8">
      <div className="relative w-full flex flex-col items-center gap-4">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Score</h2>
        <h1
          className={`font-headline text-8xl font-bold transition-colors duration-150 ${boostTextColor}`}
        >
          {score.toLocaleString()}
        </h1>
        <div className="w-full mt-4">
          <p className="text-center text-sm text-muted-foreground mt-2 flex items-center justify-center gap-2">
            <TimerIcon className="h-4 w-4" />
            <span>{timeLeft}s remaining</span>
            <BoostStatus />
          </p>
        </div>
      </div>

      <div className="relative w-64 h-64 flex items-center justify-center">
        <svg className="absolute w-[256px] h-[256px] -rotate-90">
          <circle
            cx="128"
            cy="128"
            r={CIRCLE_RADIUS}
            stroke="hsl(var(--border))"
            strokeWidth="8"
            fill="transparent"
          />
          <circle
            cx="128"
            cy="128"
            r={CIRCLE_RADIUS}
            stroke="hsl(var(--primary))"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={CIRCLE_CIRCUMFERENCE}
            strokeDashoffset={progressOffset}
            className="transition-all duration-1000 ease-linear"
          />
        </svg>
        <button
          onClick={handleTap}
          disabled={gameState === "ended" || activeEffect === 'frenzy'}
          className="relative w-56 h-56 bg-primary rounded-full text-primary-foreground flex flex-col items-center justify-center text-2xl font-bold transition-all duration-300 ease-in-out shadow-lg hover:scale-105 active:scale-95 disabled:bg-muted disabled:text-muted-foreground disabled:scale-100 disabled:cursor-not-allowed group"
          aria-label={tapAreaText}
        >
          <Hand className="w-16 h-16 mb-2 transition-transform group-hover:scale-110 group-active:scale-90" />
          <span>{tapAreaText}</span>
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        {gameState === 'idle' && (
           <Button
            onClick={activateTimeBoost}
            disabled={(inventory.extraTime || 0) <= 0 || timeBoostUsed}
            size="lg"
            variant="outline"
          >
            <Clock className="mr-2" />
            Use Extra Time ({inventory.extraTime || 0})
          </Button>
        )}
        {gameState === 'playing' && (
          <>
            <Button onClick={() => activateBoost('rocket')} disabled={(inventory.rocket || 0) <= 0 || !!activeEffect} variant="outline"><Rocket />({inventory.rocket || 0})</Button>
            <Button onClick={() => activateBoost('missile')} disabled={(inventory.missile || 0) <= 0 || !!activeEffect} variant="destructive"><Bomb />({inventory.missile || 0})</Button>
            <Button onClick={() => activateEffectBoost('freezeTime')} disabled={(inventory.freezeTime || 0) <= 0 || !!activeEffect} variant="outline" className="text-cyan-400 border-cyan-400 hover:bg-cyan-400 hover:text-white"><Snowflake />({inventory.freezeTime || 0})</Button>
            <Button onClick={() => activateEffectBoost('frenzy')} disabled={(inventory.frenzy || 0) <= 0 || !!activeEffect} variant="outline" className="text-purple-500 border-purple-500 hover:bg-purple-500 hover:text-white"><Zap />({inventory.frenzy || 0})</Button>
            <Button onClick={() => activateInstantBoost('scoreBomb')} disabled={(inventory.scoreBomb || 0) <= 0} variant="outline" className="text-green-500 border-green-500 hover:bg-green-500 hover:text-white"><Gift />({inventory.scoreBomb || 0})</Button>
          </>
        )}
        {gameState === "ended" && (
          <Button onClick={resetGame} size="lg" className="mt-4">
            <Repeat className="mr-2" />
            Play Again
          </Button>
        )}
      </div>

      <AlertDialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="text-destructive" />
              Privacy Warning
            </AlertDialogTitle>
            <AlertDialogDescription>{privacyWarning}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setIsModalOpen(false)}>
              Understood
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
