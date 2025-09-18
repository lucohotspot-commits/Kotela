
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
  { id: 'rocket', name: 'Rocket Boost', description: '2x coin multiplier for 5s.', cost: 500, icon: Rocket, color: "text-yellow-500" },
  { id: 'missile', name: 'Missile Boost', description: '3x coin multiplier for 3s.', cost: 1500, icon: Bomb, color: "text-red-500" },
  { id: 'extraTime', name: 'Extra Time', description: 'Adds 10 seconds to the game.', cost: 0, icon: Clock, color: "text-blue-500", free: true, adUrl: 'https://www.youtube.com/embed/R3GfuzLMPkA?autoplay=1' },
  { id: 'freezeTime', name: 'Freeze Time', description: 'Pause the timer for 5s.', cost: 2000, icon: Snowflake, color: "text-cyan-400" },
  { id: 'scoreBomb', name: 'Coin Bomb', description: 'Instantly get 1,000 coins.', cost: 3000, icon: Gift, color: "text-green-500" },
  { id: 'frenzy', name: 'Frenzy', description: 'Auto-mine for 3 seconds.', cost: 2500, icon: Zap, color: "text-purple-500" },
];


export function Store({ onPurchase }: StoreProps) {
  const [currency, setCurrency] = useState(getCurrency());
  const [isWatchingAd, setIsWatchingAd] = useState(false);
  const [adBoost, setAdBoost] = useState<{id: string, adUrl?: string} | null>(null);
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
        title: "Not enough coins!",
        description: "Play more games to earn coins for boosts.",
      });
    }
  };

  const startWatchingAd = () => {
    setIsWatchingAd(true);
    setTimeout(() => {
      if (adBoost) {
        addBoost(adBoost.id, 1);
        onPurchase();
        toast({
          title: "Reward Claimed!",
          description: `You got an ${boosts.find(b => b.id === adBoost.id)?.name}.`,
        });
      }
      // Automatically close and reset after timeout
      closeAdDialog();
    }, 29000); // 29-second ad simulation
  };
  
  const closeAdDialog = () => {
    setAdBoost(null);
    setIsWatchingAd(false);
  }


  return (
    <div className="space-y-4">
        <div className="flex items-center justify-end gap-2 text-lg font-bold text-primary px-2">
            <Coins className="w-5 h-5 text-yellow-500"/>
            <span className='text-lg'>{currency.toLocaleString()}</span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {boosts.map((boost) => (
              <Card key={boost.id} className="flex flex-col shadow-sm hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="flex-row items-start gap-4 space-y-0 pb-2">
                    <div className="p-3 bg-muted rounded-full">
                        <boost.icon className={`w-5 h-5 ${boost.color}`}/>
                    </div>
                    <div className="space-y-0.5">
                        <CardTitle className="text-base">{boost.name}</CardTitle>
                        <CardDescription className="text-xs">{boost.description}</CardDescription>
                    </div>
                </CardHeader>
                <CardFooter className="flex-grow flex items-center justify-between mt-auto pt-3 pb-3 px-4 border-t">
                  {boost.free ? (
                     <AlertDialog open={!!adBoost && adBoost.id === boost.id} onOpenChange={(open) => !open && closeAdDialog()}>
                      <AlertDialogTrigger asChild>
                         <Button variant="outline" size="sm" className='w-full' onClick={() => setAdBoost(boost)}>
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
                        {isWatchingAd && adBoost?.adUrl ? (
                             <div className="w-full aspect-video bg-black rounded-lg overflow-hidden">
                                 <iframe
                                    width="100%"
                                    height="100%"
                                    src={adBoost.adUrl}
                                    title="YouTube video player"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        ) : (
                            <div className='flex items-center justify-center p-4 h-48'>
                                <p>Click "Watch Now" to start the ad.</p>
                            </div>
                        )}
                        <AlertDialogFooter>
                          <AlertDialogCancel onClick={closeAdDialog} disabled={isWatchingAd}>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={(e) => {
                            e.preventDefault();
                            startWatchingAd();
                          }} disabled={isWatchingAd}>
                            {isWatchingAd ? "Claiming Reward..." : "Watch Now"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  ) : (
                    <>
                        <div className="font-bold text-base flex items-center gap-1">
                            <Coins className="w-4 h-4 text-yellow-500" />
                            {boost.cost.toLocaleString()}
                        </div>
                        <Button onClick={() => handlePurchase(boost.id, boost.cost)} disabled={currency < boost.cost} size="sm">
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
