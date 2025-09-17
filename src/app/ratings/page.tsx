
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TrendingUp, TrendingDown, Minus, Coins } from 'lucide-react';

type Coin = {
  name: string;
  symbol: string;
  price: number;
  change: number;
};

const initialCoins: Coin[] = [
  { name: 'Bitcoin', symbol: 'BTC', price: 68000, change: 0 },
  { name: 'Ethereum', symbol: 'ETH', price: 3500, change: 0 },
  { name: 'Solana', symbol: 'SOL', price: 150, change: 0 },
  { name: 'Dogecoin', symbol: 'DOGE', price: 0.15, change: 0 },
  { name: 'Kotela Coin', symbol: 'KTC', price: 1.00, change: 0 },
];

export default function RatingsPage() {
  const [coins, setCoins] = useState<Coin[]>(initialCoins);

  useEffect(() => {
    const interval = setInterval(() => {
      setCoins(coins =>
        coins.map(coin => {
          const change = (Math.random() - 0.5) * (coin.price * 0.05); // Fluctuate by up to 5%
          const newPrice = Math.max(0.01, coin.price + change);
          return {
            ...coin,
            price: newPrice,
            change: newPrice - coin.price,
          };
        })
      );
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, []);

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-500';
    if (change < 0) return 'text-red-500';
    return 'text-muted-foreground';
  };
  
  const ChangeIcon = ({ change }: { change: number }) => {
    if (change > 0) return <TrendingUp className="h-4 w-4" />;
    if (change < 0) return <TrendingDown className="h-4 w-4" />;
    return <Minus className="h-4 w-4" />;
  };

  return (
    <div className="flex-grow flex flex-col items-center">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Coins className="h-6 w-6 text-yellow-500" />
            <span>Coin Ratings</span>
          </CardTitle>
          <CardDescription>Live prices for popular cryptocurrencies.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Coin</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Change (24h)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {coins.map((coin) => (
                <TableRow key={coin.symbol}>
                  <TableCell>
                    <div className="font-bold">{coin.name}</div>
                    <div className="text-xs text-muted-foreground">{coin.symbol}</div>
                  </TableCell>
                  <TableCell className="text-right font-mono">${coin.price.toFixed(2)}</TableCell>
                  <TableCell className={`text-right font-mono flex items-center justify-end gap-1 ${getChangeColor(coin.change)}`}>
                    <ChangeIcon change={coin.change} />
                    {coin.change.toFixed(2)}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
