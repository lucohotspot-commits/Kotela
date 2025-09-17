"use client";

import { useState, useEffect, useCallback } from 'react';
import { GameEngine } from '@/components/game-engine';
import { Leaderboard } from '@/components/leaderboard';
import { Store } from '@/components/store';
import { getInventory, getScores, getCurrency, type Score } from '@/lib/storage';
import { Separator } from '@/components/ui/separator';
import { Github, ShoppingCart, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

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

  const handleGameEnd = useCallback(() => {
    refreshData();
  }, [refreshData]);

  const handlePurchase = useCallback(() => {
    refreshData();
  }, [refreshData]);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="absolute top-0 right-0 p-4 sm:p-6 flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm text-muted-foreground">My Points</p>
          <p className="text-2xl font-bold text-primary">{currency.toLocaleString()}</p>
        </div>
        <Dialog open={isStoreOpen} onOpenChange={setIsStoreOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="lg">
              <ShoppingCart className="mr-2" /> Store
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle className='flex items-center gap-2'>
                <ShoppingCart />
                Boost Store
              </DialogTitle>
            </DialogHeader>
            <Store onPurchase={handlePurchase} />
          </DialogContent>
        </Dialog>
      </header>
      
      <main className="flex-grow flex flex-col items-center justify-center bg-background p-4 sm:p-8 mt-20 sm:mt-0">
        <div className="flex flex-col items-center text-center mb-12">
          <h1 className="text-5xl font-bold tracking-tight text-primary font-headline">
            Kotela
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            How fast can you tap in 30 seconds? Use boosts to get a high score!
          </p>
        </div>
        
        <div className="w-full flex flex-col lg:flex-row items-center lg:items-start justify-center gap-12 lg:gap-16">
          <GameEngine onGameEnd={handleGameEnd} inventory={inventory} refreshInventory={refreshData} />
          <Separator orientation="vertical" className="hidden lg:block h-auto self-stretch" />
          <div className="w-full max-w-md flex flex-col gap-8">
            <Leaderboard scores={scores} />
            <div className="p-4 border rounded-lg">
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2"><Rocket/> My Boosts</h3>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                        <Rocket className="w-5 h-5 text-primary"/>
                        <span className="font-bold">Rocket Boost x {inventory.rocket || 0}</span>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full p-8 text-center text-sm text-muted-foreground">
        <p>Built with Next.js and Genkit.</p>
         <a href="https://github.com/firebase/studio-kotela" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-primary mt-2">
            <Github size={16} />
            View on GitHub
         </a>
      </footer>
    </div>
  );
}
