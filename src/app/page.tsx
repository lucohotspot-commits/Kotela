"use client";

import { useState, useEffect, useCallback } from 'react';
import { GameEngine } from '@/components/game-engine';
import { Leaderboard } from '@/components/leaderboard';
import { Store } from '@/components/store';
import { getInventory, getScores, getCurrency, type Score } from '@/lib/storage';
import { Separator } from '@/components/ui/separator';
import { Github, ShoppingCart, Rocket, Bomb, Clock, Zap, Gift, Snowflake, Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function Home() {
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
  }, [refreshData]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-20 w-full bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M13.5 4.5 21 12l-7.5 7.5" />
                <path d="M3 12h18" />
                <path d="m10.5 19.5-7.5-7.5 7.5-7.5" />
              </svg>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-primary font-headline">
              Kotela
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-muted-foreground">My Coins</p>
              <div className="flex items-center justify-end gap-1">
                <Coins className="h-4 w-4 text-yellow-500" />
                <p className="text-lg font-bold text-primary">{currency.toLocaleString()}</p>
              </div>
            </div>
            <Dialog open={isStoreOpen} onOpenChange={setIsStoreOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <ShoppingCart className="mr-2" /> Store
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md sm:max-w-4xl lg:max-w-6xl h-full sm:h-auto sm:max-h-[800px]">
                <DialogHeader>
                  <DialogTitle className='flex items-center gap-2'>
                    <ShoppingCart />
                    Boost Store
                  </DialogTitle>
                </DialogHeader>
                <ScrollArea className="h-full -mx-6">
                  <div className="px-6 pb-6">
                    <Store onPurchase={refreshData} />
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center text-center mb-8">
          <p className="mt-2 text-sm text-muted-foreground max-w-prose">
            Tap once to start mining. Use boosts to get a high score!
          </p>
        </div>
        
        <div className="w-full flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8 lg:gap-16">
          <GameEngine onGameEnd={refreshData} inventory={inventory} refreshInventory={refreshData} />
          <Separator orientation="vertical" className="hidden lg:block h-auto self-stretch" />
          <div className="w-full max-w-md flex flex-col gap-6">
            <Leaderboard scores={scores} />
            <div className="p-4 border rounded-lg">
                <h3 className="text-base font-semibold mb-3 flex items-center gap-2"><Rocket/> My Boosts</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                        <Rocket className="w-4 h-4 text-yellow-500"/>
                        <span className="font-bold text-xs">Rocket x {inventory.rocket || 0}</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                        <Bomb className="w-4 h-4 text-red-500"/>
                        <span className="font-bold text-xs">Missile x {inventory.missile || 0}</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                        <Clock className="w-4 h-4 text-blue-500"/>
                        <span className="font-bold text-xs">Extra Time x {inventory.extraTime || 0}</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                        <Snowflake className="w-4 h-4 text-cyan-400"/>
                        <span className="font-bold text-xs">Freeze Time x {inventory.freezeTime || 0}</span>
                    </div>
                     <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                        <Zap className="w-4 h-4 text-purple-500"/>
                        <span className="font-bold text-xs">Frenzy x {inventory.frenzy || 0}</span>
                    </div>
                     <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                        <Gift className="w-4 h-4 text-green-500"/>
                        <span className="font-bold text-xs">Score Bomb x {inventory.scoreBomb || 0}</span>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full p-6 text-center text-xs text-muted-foreground">
        <p>Built with Next.js and Genkit.</p>
         <a href="https://github.com/firebase/studio-kotela" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-primary mt-1">
            <Github size={14} />
            View on GitHub
         </a>
      </footer>
    </div>
  );
}
