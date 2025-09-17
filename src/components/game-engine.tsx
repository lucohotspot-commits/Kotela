"use client";

import { useMemo } from "react";
import { Pickaxe, Repeat, AlertTriangle, TimerIcon, Rocket, Bomb, Clock, Zap, Gift, Snowflake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGame } from "@/context/GameContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function GameEngine() {
  const {
    score,
    timeLeft,
    gameState,
    privacyWarning,
    activeBoost,
    activeEffect,
    boostTimeLeft,
    inventory,
    isModalOpen,
    scoreIncrement,
    gameDuration,
    timeBoostUsed,
    handleTap,
    resetGame,
    activateBoost,
    activateEffectBoost,
    activateInstantBoost,
    activateTimeBoost,
    setIsModalOpen,
  } = useGame();

  const CIRCLE_RADIUS = 100;
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
      <span className={`absolute -bottom-6 flex items-center gap-1 font-bold text-xs ${boostTextColor}`}>
        {icon}
        {text}
      </span>
    );
  };

  return (
    <div className="w-full max-w-md flex flex-col items-center gap-6">
      <div className="relative w-56 h-56 flex items-center justify-center">
        <svg className={`absolute w-[224px] h-[224px] -rotate-90 transition-all duration-300 ${gameState === 'playing' ? 'animate-glow' : ''}`} style={{ filter: `drop-shadow(0 0 5px hsl(var(--primary)))`}}>
          <circle
            cx="112"
            cy="112"
            r={CIRCLE_RADIUS}
            stroke="hsl(var(--border))"
            strokeWidth="8"
            fill="transparent"
          />
          <circle
            cx="112"
            cy="112"
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
          disabled={gameState !== 'idle'}
          className="relative w-48 h-48 bg-background rounded-full text-foreground flex flex-col items-center justify-center text-xl font-bold transition-all duration-300 ease-in-out shadow-lg hover:scale-105 active:scale-95 disabled:bg-muted disabled:text-muted-foreground disabled:scale-100 disabled:cursor-not-allowed group data-[state=playing]:bg-background/80"
          aria-label="Game button"
          data-state={gameState}
        >
          {gameState === 'idle' && (
            <div className='text-center'>
              <Pickaxe className="w-12 h-12 mb-2 transition-transform group-hover:scale-110 group-active:scale-90 inline-block" />
              <span className="text-lg font-semibold">Tap to Mine</span>
            </div>
          )}
          {gameState === 'playing' && (
            <div className="text-center">
              <div className="text-xs uppercase text-muted-foreground">Coins</div>
              <div className={`text-6xl font-bold ${boostTextColor}`}>{score.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground mt-1 flex items-center justify-center gap-1">
                <TimerIcon className="h-3 w-3" />
                <span>{timeLeft}s remaining</span>
              </div>
              <BoostStatus />
            </div>
          )}
          {gameState === 'ended' && (
            <div className='text-center'>
              <div className="text-xs uppercase text-muted-foreground">Game Over</div>
              <div className={`text-5xl font-bold ${boostTextColor}`}>{score.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground mt-1">Final Coins</div>
            </div>
          )}
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        {gameState === 'idle' && (
           <Button
            onClick={activateTimeBoost}
            disabled={(inventory.extraTime || 0) <= 0 || timeBoostUsed}
            size="sm"
            variant="outline"
          >
            <Clock className="mr-2" />
            Use Extra Time ({inventory.extraTime || 0})
          </Button>
        )}
        {gameState === 'playing' && (
          <>
            <Button onClick={() => activateBoost('rocket')} disabled={(inventory.rocket || 0) <= 0 || !!activeEffect} variant="outline" size="sm"><Rocket />({inventory.rocket || 0})</Button>
            <Button onClick={() => activateBoost('missile')} disabled={(inventory.missile || 0) <= 0 || !!activeEffect} variant="destructive" size="sm"><Bomb />({inventory.missile || 0})</Button>
            <Button onClick={() => activateEffectBoost('freezeTime')} disabled={(inventory.freezeTime || 0) <= 0 || !!activeEffect} variant="outline" size="sm" className="text-cyan-400 border-cyan-400 hover:bg-cyan-400 hover:text-white"><Snowflake />({inventory.freezeTime || 0})</Button>
            <Button onClick={() => activateEffectBoost('frenzy')} disabled={(inventory.frenzy || 0) <= 0 || !!activeEffect} variant="outline" size="sm" className="text-purple-500 border-purple-500 hover:bg-purple-500 hover:text-white"><Zap />({inventory.frenzy || 0})</Button>
            <Button onClick={() => activateInstantBoost('scoreBomb')} disabled={(inventory.scoreBomb || 0) <= 0} variant="outline" size="sm" className="text-green-500 border-green-500 hover:bg-green-500 hover:text-white"><Gift />({inventory.scoreBomb || 0})</Button>
          </>
        )}
        {gameState === "ended" && (
          <Button onClick={resetGame} size="lg" className="mt-4">
            <Repeat className="mr-2" />
            Mine Again
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
