"use client";

import { useState, useEffect, useCallback } from 'react';
import { GameEngine } from '@/components/game-engine';
import { Leaderboard } from '@/components/leaderboard';
import { getScores, type Score } from '@/lib/storage';
import { Separator } from '@/components/ui/separator';
import { Github } from 'lucide-react';

export default function Home() {
  const [scores, setScores] = useState<Score[]>([]);

  const refreshScores = useCallback(() => {
    setScores(getScores());
  }, []);

  useEffect(() => {
    refreshScores();
  }, [refreshScores]);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow flex flex-col items-center justify-center bg-background p-4 sm:p-8">
        <div className="flex flex-col items-center text-center mb-12">
          <h1 className="text-5xl font-bold tracking-tight text-primary font-headline">
            Kotela
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            How fast can you tap in 30 seconds?
          </p>
        </div>

        <div className="w-full flex flex-col lg:flex-row items-center lg:items-start justify-center gap-12 lg:gap-16">
          <GameEngine onGameEnd={refreshScores} />
          <Separator orientation="vertical" className="hidden lg:block h-auto self-stretch" />
          <Leaderboard scores={scores} />
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
