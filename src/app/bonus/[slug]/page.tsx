
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Plane, Coins } from 'lucide-react';
import { useParams } from 'next/navigation';

const gameDetails: { [key: string]: { name: string; description: string } } = {
  'aviator': {
    name: 'Aviator',
    description: 'Watch the multiplier grow and cash out before the plane flies away!'
  },
  // Add other game details here
};


export default function BonusGamePage() {
  const params = useParams();
  const slug = params.slug as string;
  const details = gameDetails[slug] || { name: 'Game', description: 'Play to win!' };

  const [multiplier, setMultiplier] = useState(1.00);
  const [gameState, setGameState] = useState<'waiting' | 'playing' | 'crashed'>('waiting');

  useEffect(() => {
    let gameLoop: NodeJS.Timeout;
    if (gameState === 'playing') {
      gameLoop = setInterval(() => {
        setMultiplier(m => m + 0.01);
      }, 100);
    } else {
      setMultiplier(1.00);
    }

    return () => clearInterval(gameLoop);
  }, [gameState]);

  const handleBet = () => {
    setGameState('playing');
    // Simulate crash
    setTimeout(() => {
      setGameState('crashed');
    }, Math.random() * 8000 + 2000);
  };

  const handleReset = () => {
    setGameState('waiting');
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-primary">{details.name}</h1>
        <p className="text-muted-foreground">{details.description}</p>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="relative aspect-video w-full bg-muted/20 rounded-lg overflow-hidden">
            {/* Grid background */}
            <div className="absolute inset-0 z-0" style={{ backgroundImage: 'linear-gradient(rgba(128,128,128,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(128,128,128,0.2) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            
            <div className="absolute inset-0 flex items-center justify-center">
              {gameState === 'playing' && (
                <div className="relative">
                  <Plane className="h-16 w-16 text-primary transform -rotate-45 animate-pulse" />
                   <p className="absolute -top-8 left-1/2 -translate-x-1/2 text-2xl font-bold text-primary">{multiplier.toFixed(2)}x</p>
                </div>
              )}
               {gameState === 'waiting' && (
                <p className="text-2xl font-semibold text-muted-foreground">Waiting for next round...</p>
              )}
               {gameState === 'crashed' && (
                <div className="text-center">
                  <p className="text-4xl font-bold text-destructive">Flew Away!</p>
                  <p className="text-lg text-muted-foreground">Multiplier: {multiplier.toFixed(2)}x</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="flex-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Bet Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">-</Button>
                <Input defaultValue="1.00" className="text-center" />
                <Button variant="outline" size="sm">+</Button>
                <Coins className="text-yellow-500" />
            </div>
            {gameState === 'waiting' ? (
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white text-lg h-12" onClick={handleBet}>
                Bet
              </Button>
            ) : (
               <Button className="w-full text-lg h-12" onClick={handleReset} variant="secondary">
                {gameState === 'crashed' ? 'Play Again' : 'Cash Out'}
              </Button>
            )}
          </CardContent>
        </Card>
        
        <Card className="flex-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Auto Play</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-bet">Auto Bet</Label>
              <Switch id="auto-bet" />
            </div>
             <div className="flex items-center justify-between">
              <Label htmlFor="auto-cashout">Auto Cashout</Label>
              <Switch id="auto-cashout" />
            </div>
            <div className='relative'>
                <Input type="text" placeholder='Multiplier' defaultValue={"1.50"} />
                <span className='absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground'>x</span>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
