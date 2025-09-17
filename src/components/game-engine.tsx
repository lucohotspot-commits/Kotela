"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Hand, Repeat, AlertTriangle, TimerIcon } from "lucide-react";
import { Progress } from "@/components/ui/progress";
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
  const [tapTimestamps, setTapTimestamps] = useState<number[]>([]);
  const [privacyWarning, setPrivacyWarning] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        taps: tapTimestamps.length,
        gameEndTime: new Date().toISOString(),
      });

      checkForPrivacyIssues(gameData).then((warning) => {
        if (warning) {
          setPrivacyWarning(warning);
          setIsModalOpen(true);
        }
      });
    }
  }, [gameState, score, onGameEnd, tapTimestamps]);

  const handleTap = useCallback(() => {
    if (gameState === "ended") return;
    if (gameState === "idle") {
      setGameState("playing");
    }

    const now = Date.now();
    const oneSecondAgo = now - 1000;
    
    const recentTaps = [...tapTimestamps, now].filter((t) => t > oneSecondAgo);
    setTapTimestamps(recentTaps);
    
    const tapsPerSecond = recentTaps.length;
    const increment = 1 + Math.floor(tapsPerSecond / 5);

    setScore((s) => s + increment);
  }, [gameState, tapTimestamps]);

  const resetGame = () => {
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setTapTimestamps([]);
    setGameState("idle");
    setPrivacyWarning(null);
  };

  const progressValue = (timeLeft / GAME_DURATION) * 100;

  const tapAreaText = useMemo(() => {
    if (gameState === "idle") return "Tap to Start";
    if (gameState === "ended") return "Game Over";
    return "Tap!";
  }, [gameState]);

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
          <Progress value={progressValue} className="h-4 [&>div]:bg-muted-foreground" />
          <p className="text-center text-sm text-muted-foreground mt-2 flex items-center justify-center gap-2">
            <TimerIcon className="h-4 w-4" />
            <span>{timeLeft}s remaining</span>
          </p>
        </div>
      </div>

      <button
        onClick={handleTap}
        disabled={gameState === "ended"}
        className="relative w-64 h-64 bg-primary rounded-full text-primary-foreground flex flex-col items-center justify-center text-2xl font-bold transition-all duration-300 ease-in-out shadow-lg hover:scale-105 active:scale-95 disabled:bg-muted disabled:text-muted-foreground disabled:scale-100 disabled:cursor-not-allowed group"
        aria-label={tapAreaText}
      >
        <Hand className="w-16 h-16 mb-2 transition-transform group-hover:scale-110 group-active:scale-90" />
        <span>{tapAreaText}</span>
      </button>

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
