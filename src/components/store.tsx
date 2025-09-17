"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrency, spendCurrency, addBoost } from '@/lib/storage';
import { Rocket, Coins } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface StoreProps {
  onPurchase: () => void;
}

const boosts = [
  { id: 'rocket', name: 'Rocket Boost', description: 'Doubles your score rate for 5 seconds.', cost: 500, icon: Rocket },
];

export function Store({ onPurchase }: StoreProps) {
  const [currency, setCurrency] = useState(getCurrency());
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

  return (
    <div className="grid gap-4">
        <div className="flex items-center justify-end gap-2 text-lg font-bold text-primary">
            <Coins className="w-5 h-5"/>
            <span>My Points: {currency.toLocaleString()}</span>
        </div>
      {boosts.map((boost) => (
        <Card key={boost.id}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <boost.icon />
                {boost.name}
            </CardTitle>
            <CardDescription>{boost.description}</CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-between items-center">
            <div className="font-bold text-lg flex items-center gap-1">
                <Coins className="w-4 h-4 text-yellow-500" />
                {boost.cost} Points
            </div>
            <Button onClick={() => handlePurchase(boost.id, boost.cost)} disabled={currency < boost.cost}>
              Buy
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}