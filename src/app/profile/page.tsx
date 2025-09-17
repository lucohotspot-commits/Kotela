"use client";

import { useState, useEffect } from 'react';
import { getCurrency, getScores, getInventory } from '@/lib/storage';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Coins, Rocket, Bomb, Clock, Zap, Gift, Snowflake, Trophy } from 'lucide-react';

export default function ProfilePage() {
  const [currency, setCurrency] = useState(0);
  const [totalGames, setTotalGames] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [inventory, setInventory] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const scores = getScores();
    setCurrency(getCurrency());
    setInventory(getInventory());
    setTotalGames(scores.length);
    setHighScore(scores.length > 0 ? scores[0].score : 0);
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-center gap-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src="https://picsum.photos/seed/user-avatar/100" alt="User Avatar" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="text-center sm:text-left">
            <CardTitle className="text-3xl">Player One</CardTitle>
            <CardDescription>Expert Miner</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Total Coins</p>
              <div className="flex items-center justify-center gap-1 text-2xl font-bold">
                <Coins className="h-6 w-6 text-yellow-500" />
                {currency.toLocaleString()}
              </div>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">High Score</p>
               <div className="flex items-center justify-center gap-1 text-2xl font-bold">
                <Trophy className="h-6 w-6 text-yellow-500" />
                {highScore.toLocaleString()}
              </div>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Games Played</p>
              <p className="text-2xl font-bold">{totalGames}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket /> My Boosts
          </CardTitle>
          <CardDescription>Your current collection of power-ups.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <Rocket className="w-6 h-6 text-yellow-500" />
              <div>
                <span className="font-bold">Rocket</span>
                <p className="text-sm text-muted-foreground">x {inventory.rocket || 0}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <Bomb className="w-6 h-6 text-red-500" />
              <div>
                <span className="font-bold">Missile</span>
                <p className="text-sm text-muted-foreground">x {inventory.missile || 0}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <Clock className="w-6 h-6 text-blue-500" />
              <div>
                <span className="font-bold">Extra Time</span>
                <p className="text-sm text-muted-foreground">x {inventory.extraTime || 0}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <Snowflake className="w-6 h-6 text-cyan-400" />
              <div>
                <span className="font-bold">Freeze Time</span>
                <p className="text-sm text-muted-foreground">x {inventory.freezeTime || 0}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <Zap className="w-6 h-6 text-purple-500" />
              <div>
                <span className="font-bold">Frenzy</span>
                <p className="text-sm text-muted-foreground">x {inventory.frenzy || 0}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <Gift className="w-6 h-6 text-green-500" />
              <div>
                <span className="font-bold">Coin Bomb</span>
                <p className="text-sm text-muted-foreground">x {inventory.scoreBomb || 0}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
