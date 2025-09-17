
"use client";

import { useState, useEffect, useCallback } from 'react';
import { GameEngine } from '@/components/game-engine';
import { Leaderboard } from '@/components/leaderboard';
import { Store } from '@/components/store';
import { getInventory, getScores, getCurrency, type Score } from '@/lib/storage';
import { Separator } from '@/components/ui/separator';
import { Github, ShoppingCart, Rocket, Bomb, Clock, Zap, Gift, Snowflake, Coins, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import Link from 'next/link';
import { useUserLocation } from '@/hooks/use-user-location';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const [scores, setScores] = useState<Score[]>([]);
  const [currency, setCurrency] = useState(0);
  const [inventory, setInventory] = useState<{ [key: string]: number }>({});
  const [isStoreOpen, setIsStoreOpen] = useState(false);
  const userLocation = useUserLocation();

  const refreshData = useCallback(() => {
    setScores(getScores());
    setCurrency(getCurrency());
    setInventory(getInventory());
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-background">
      <header className="py-4">
        <div className="container mx-auto flex w-full flex-col items-end sm:items-center sm:flex-row justify-between gap-4">
            <div className="mr-auto">
                 <h1 className="text-2xl font-bold tracking-tight text-primary font-headline">
                    Mine
                </h1>
                <p className="text-sm text-muted-foreground max-w-xs">
                    Tap the coin to start mining. Use boosts to get a high score!
                </p>
            </div>
            <div className="flex items-center gap-4">
                <div className="flex items-center justify-end gap-2 text-lg font-bold text-primary px-2">
                    <Coins className="w-5 h-5 text-yellow-500"/>
                    <span className='text-lg'>{currency.toLocaleString()}</span>
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

      <main className="relative flex-grow flex flex-col items-center justify-center">
        <div className="w-full flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8 lg:gap-16">
          <div className="relative">
            <GameEngine onGameEnd={refreshData} inventory={inventory} refreshInventory={refreshData} />
          </div>
          <Separator orientation="vertical" className="hidden lg:block h-auto self-stretch" />
          <div className="w-full max-w-md flex flex-col gap-6">
            <Leaderboard scores={scores} />
             <div className="p-4 border rounded-lg">
                <h3 className="text-base font-semibold mb-2 flex items-center gap-2"><MapPin/> Location</h3>
                {userLocation.loading ? (
                  <Skeleton className="h-4 w-48" />
                ) : userLocation.error ? (
                  <p className="text-xs text-destructive">{userLocation.error}</p>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Lat: {userLocation.latitude?.toFixed(4)}, Lon: {userLocation.longitude?.toFixed(4)}
                  </p>
                )}
            </div>
            <div className="p-4 border rounded-lg">
                <h3 className="text-base font-semibold mb-1 flex items-center gap-2"><Rocket/> My Boosts</h3>
                <p className="text-xs text-muted-foreground mb-3">Activate these power-ups during a game by clicking the buttons below the mining coin.</p>
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
