"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Hand, Repeat, AlertTriangle, TimerIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addScore } from "@/lib/storage";
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

const GAME_DURATION = 30; // 30 seconds

type GameState = "idle" | "playing" | "ended";

interface GameEngineProps {
  onGameEnd: () => void;
}

export function GameEngine({ onGameEnd }: GameEngineProps) {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [gameState, setGameState] = useState<GameState>("idle");
  const [privacyWarning, setPrivacyWarning] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Score increment logic
  useEffect(() => {
    if (gameState !== "playing") return;

    const scoreInterval = setInterval(() => {
      setScore((s) => s + 1);
    }, 100);

    return () => clearInterval(scoreInterval);
  }, [gameState]);

  // Timer logic
  useEffect(() => {
    if (gameState !== "playing") return;

    if (timeLeft <= 0) {
      setGameState("ended");
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [gameState, timeLeft]);

  // Game end logic
  useEffect(() => {
    if (gameState === "ended") {
      addScore(score);
      onGameEnd();

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

  const handleTap = useCallback(() => {
    if (gameState === "idle") {
      setGameState("playing");
    }
  }, [gameState]);

  const resetGame = () => {
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setGameState("idle");
    setPrivacyWarning(null);
  };

  const tapAreaText = useMemo(() => {
    if (gameState === "idle") return "Tap to Start";
    if (gameState === "ended") return "Game Over";
    return "Tapping...";
  }, [gameState]);

  const CIRCLE_RADIUS = 120;
  const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;
  const progressOffset =
    CIRCLE_CIRCUMFERENCE -
    (timeLeft / GAME_DURATION) * CIRCLE_CIRCUMFERENCE;

  return (
    <div className="w-full max-w-md flex flex-col items-center gap-8">
      <div className="relative w-full flex flex-col items-center gap-4">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Score</h2>
        <h1
          className={`font-headline text-8xl font-bold text-foreground transition-transform duration-150 ${
            gameState === "playing" ? "animate-pulse-subtle" : ""
          }`}
        >
          {score.toLocaleString()}
        </h1>
        <div className="w-full mt-4">
          <p className="text-center text-sm text-muted-foreground mt-2 flex items-center justify-center gap-2">
            <TimerIcon className="h-4 w-4" />
            <span>{timeLeft}s remaining</span>
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
          disabled={gameState !== "idle"}
          className="relative w-56 h-56 bg-primary rounded-full text-primary-foreground flex flex-col items-center justify-center text-2xl font-bold transition-all duration-300 ease-in-out shadow-lg hover:scale-105 active:scale-95 disabled:bg-muted disabled:text-muted-foreground disabled:scale-100 disabled:cursor-not-allowed group"
          aria-label={tapAreaText}
        >
          <Hand className="w-16 h-16 mb-2 transition-transform group-hover:scale-110 group-active:scale-90" />
          <span>{tapAreaText}</span>
        </button>
      </div>


      {gameState === "ended" && (
        <Button onClick={resetGame} size="lg" className="mt-4">
          <Repeat className="mr-2 h-4 w-4" />
          Play Again
        </Button>
      )}

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
