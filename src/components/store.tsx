"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrency, spendCurrency, addBoost } from '@/lib/storage';
import { Rocket, Coins, Bomb, Clock,Youtube } from 'lucide-react';
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
  { id: 'rocket', name: 'Rocket Boost', description: '2x score multiplier for 5 seconds.', cost: 500, icon: Rocket, color: "text-yellow-500" },
  { id: 'missile', name: 'Missile Boost', description: '3x score multiplier for 3 seconds.', cost: 1500, icon: Bomb, color: "text-red-500" },
];

const freeBoosts = [
  { id: 'extraTime', name: 'Extra Time', description: 'Adds 10 seconds to your next game.', icon: Clock, color: "text-blue-500" },
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
        description: `You got an ${freeBoosts.find(b => b.id === boostId)?.name}.`,
      });
    }, 3000); // 3-second ad
  };


  return (
    <div className="grid gap-6">
        <div className="flex items-center justify-end gap-2 text-lg font-bold text-primary">
            <Coins className="w-5 h-5"/>
            <span>My Points: {currency.toLocaleString()}</span>
        </div>
        
        <div className='space-y-4'>
            <h3 className="font-semibold text-lg text-muted-foreground">Purchase with Points</h3>
            {boosts.map((boost) => (
              <Card key={boost.id} className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                      <boost.icon className={boost.color}/>
                      {boost.name}
                  </CardTitle>
                  <CardDescription>{boost.description}</CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-between items-center">
                  <div className="font-bold text-lg flex items-center gap-1">
                      <Coins className="w-4 h-4 text-yellow-500" />
                      {boost.cost.toLocaleString()} Points
                  </div>
                  <Button onClick={() => handlePurchase(boost.id, boost.cost)} disabled={currency < boost.cost}>
                    Buy
                  </Button>
                </CardFooter>
              </Card>
            ))}
        </div>
        
        <div className='space-y-4'>
             <h3 className="font-semibold text-lg text-muted-foreground">Free Boosts</h3>
            {freeBoosts.map((boost) => (
              <Card key={boost.id} className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                      <boost.icon className={boost.color}/>
                      {boost.name}
                  </CardTitle>
                  <CardDescription>{boost.description}</CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-between items-center">
                  <div className="font-bold text-lg text-green-600">
                    Free
                  </div>
                   <AlertDialog>
                      <AlertDialogTrigger asChild>
                         <Button variant="outline">
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
                            <div className="flex flex-col items-center justify-center p-4">
                                <div className="w-full aspect-video bg-black flex items-center justify-center text-white">
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
                </CardFooter>
              </Card>
            ))}
        </div>
    </div>
  );
}
