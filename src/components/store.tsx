"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrency, spendCurrency, addBoost } from '@/lib/storage';
import { Rocket, Coins, Bomb, Clock, Youtube, Zap, Gift, Snowflake } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface StoreProps {
  onPurchase: () => void;
}

const boosts = [
  { id: 'rocket', name: 'Rocket Boost', description: '2x score multiplier for 5s.', cost: 500, icon: Rocket, color: "text-yellow-500" },
  { id: 'missile', name: 'Missile Boost', description: '3x score multiplier for 3s.', cost: 1500, icon: Bomb, color: "text-red-500" },
  { id: 'extraTime', name: 'Extra Time', description: 'Adds 10 seconds to the game.', cost: 0, icon: Clock, color: "text-blue-500", free: true },
  { id: 'freezeTime', name: 'Freeze Time', description: 'Pause the timer for 5s.', cost: 2000, icon: Snowflake, color: "text-cyan-400" },
  { id: 'frenzy', name: 'Frenzy', description: 'Auto-tap for 3 seconds.', cost: 2500, icon: Zap, color: "text-purple-500" },
  { id: 'scoreBomb', name: 'Score Bomb', description: 'Instantly get 1,000 points.', cost: 3000, icon: Gift, color: "text-green-500" },
];


export function Store({ onPurchase }: StoreProps) {
  const [currency, setCurrency] = useState(getCurrency());
  const [isWatchingAd, setIsWatchingAd] = useState(false);
  const { toast } = useToast();

  const handlePurchase = (boostId: string, cost: number) => {
    const success = spendCurrency(cost);
    if (success) {
      addBoost(boostId, 1);
      setCurrency(getCurrency());
      onPurchase();
      toast({
        title: "Purchase Successful!",
        description: `You bought a ${boosts.find(b => b.id === boostId)?.name}.`,
      });
    } else {
      toast({
        variant: "destructive",
        title: "Not enough points!",
        description: "Play more games to earn points for boosts.",
      });
    }
  };

  const handleWatchAd = (boostId: string) => {
    setIsWatchingAd(true);
    // Simulate watching an ad
    setTimeout(() => {
      addBoost(boostId, 1);
      onPurchase();
      setIsWatchingAd(false);
      toast({
        title: "Reward Claimed!",
        description: `You got an ${boosts.find(b => b.id === boostId)?.name}.`,
      });
    }, 3000); // 3-second ad
  };


  return (
    <div className="space-y-6">
        <div className="flex items-center justify-end gap-2 text-lg font-bold text-primary">
            <Coins className="w-6 h-6 text-yellow-500"/>
            <span className='text-xl'>{currency.toLocaleString()}</span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {boosts.map((boost) => (
              <Card key={boost.id} className="flex flex-col shadow-sm hover:shadow-md transition-shadow duration-300">
                <CardHeader className="flex-row items-center gap-4 space-y-0 pb-4">
                    <div className="p-3 bg-muted rounded-full">
                        <boost.icon className={`w-6 h-6 ${boost.color}`}/>
                    </div>
                    <div className="space-y-1">
                        <CardTitle>{boost.name}</CardTitle>
                        <CardDescription>{boost.description}</CardDescription>
                    </div>
                </CardHeader>
                <CardFooter className="flex-grow flex items-end justify-between mt-auto pt-4 border-t">
                  {boost.free ? (
                     <AlertDialog>
                      <AlertDialogTrigger asChild>
                         <Button variant="outline" className='w-full'>
                            <Youtube className="mr-2 text-red-600"/> Watch Ad
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Watch an Ad for a Reward</AlertDialogTitle>
                          <AlertDialogDescription>
                            Watch a short video to get a free {boost.name}.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        {isWatchingAd ? (
                            <div className="flex flex-col items-center justify-center p-4 gap-2">
                                <div className="w-full aspect-video bg-black flex flex-col items-center justify-center text-white rounded-lg">
                                    <p>Your ad is playing...</p>
                                    <p className='text-xs'>(This is a placeholder)</p>
                                </div>
                                <p className="mt-2 text-sm text-muted-foreground">You will receive your reward shortly.</p>
                            </div>
                        ) : (
                            <div className='flex items-center justify-center p-4'>
                                <p>Click "Watch Now" to start the ad.</p>
                            </div>
                        )}
                        <AlertDialogFooter>
                          <AlertDialogCancel disabled={isWatchingAd}>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleWatchAd(boost.id)} disabled={isWatchingAd}>
                            {isWatchingAd ? "Watching..." : "Watch Now"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  ) : (
                    <>
                        <div className="font-bold text-lg flex items-center gap-1.5">
                            <Coins className="w-5 h-5 text-yellow-500" />
                            {boost.cost.toLocaleString()}
                        </div>
                        <Button onClick={() => handlePurchase(boost.id, boost.cost)} disabled={currency < boost.cost}>
                            Buy
                        </Button>
                    </>
                  )}
                </CardFooter>
              </Card>
            ))}
        </div>
    </div>
  );
}
