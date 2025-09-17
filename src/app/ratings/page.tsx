
"use client";

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TrendingUp, TrendingDown, Minus, Coins } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

type Coin = {
  name: string;
  symbol: string;
  price: number;
  change: number;
  history: { time: string; price: number }[];
};

const initialCoins: Coin[] = [
  { name: 'Bitcoin', symbol: 'BTC', price: 68000, change: 0, history: [] },
  { name: 'Ethereum', symbol: 'ETH', price: 3500, change: 0, history: [] },
  { name: 'Solana', symbol: 'SOL', price: 150, change: 0, history: [] },
  { name: 'Dogecoin', symbol: 'DOGE', price: 0.15, change: 0, history: [] },
  { name: 'Kotela Coin', symbol: 'KTC', price: 1.00, change: 0, history: [] },
];

export default function RatingsPage() {
  const [coins, setCoins] = useState<Coin[]>(
    initialCoins.map(c => ({
      ...c,
      history: [{ time: new Date().toLocaleTimeString(), price: c.price }],
    }))
  );
  const [selectedCoin, setSelectedCoin] = useState<Coin>(coins[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().toLocaleTimeString();
      setCoins(prevCoins =>
        prevCoins.map(coin => {
          const changeFactor = Math.random() * 0.02 - 0.01; // Fluctuate by up to 1%
          const newPrice = Math.max(0.01, coin.price * (1 + changeFactor));
          const newHistory = [...coin.history, { time: now, price: newPrice }].slice(-30); // Keep last 30 data points

          const updatedCoin = {
            ...coin,
            price: newPrice,
            change: newPrice - coin.history.at(-1)!.price,
            history: newHistory,
          };
          
          if (selectedCoin && coin.symbol === selectedCoin.symbol) {
            setSelectedCoin(updatedCoin);
          }

          return updatedCoin;
        })
      );
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, [selectedCoin]);

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

  const chartData = useMemo(() => selectedCoin.history, [selectedCoin]);
  const chartDomain: [number, number] = useMemo(() => {
    if (!chartData || chartData.length === 0) return [0, 0];
    const prices = chartData.map(d => d.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const padding = (max - min) * 0.2 || max * 0.1; // Add padding, handle case where min equals max
    return [Math.max(0, min - padding), max + padding];
  }, [chartData]);


  return (
    <div className="space-y-6">
       <Card className="w-full">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardDescription>Now viewing</CardDescription>
              <CardTitle className="text-2xl">{selectedCoin.name} ({selectedCoin.symbol})</CardTitle>
            </div>
            <div className="mt-2 sm:mt-0 text-right">
              <div className="text-3xl font-bold">${selectedCoin.price.toFixed(2)}</div>
              <div className={`text-sm flex items-center justify-end gap-1 ${getChangeColor(selectedCoin.change)}`}>
                 <ChangeIcon change={selectedCoin.change} /> {selectedCoin.change.toFixed(4)} ({((selectedCoin.change / (selectedCoin.price - selectedCoin.change)) * 100).toFixed(2)}%)
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{
            price: { label: 'Price', color: 'hsl(var(--primary))' },
          }} className="h-64 w-full">
            <AreaChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted/50" />
              <XAxis 
                dataKey="time" 
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value, index) => index % 5 === 0 ? value : ''}
              />
              <YAxis 
                domain={chartDomain}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => `$${Number(value).toFixed(2)}`}
                width={80}
              />
              <Tooltip
                cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, strokeDasharray: '3 3' }}
                content={<ChartTooltipContent indicator="dot" labelKey='price'
                  formatter={(value, name, props) => (
                    <div className='flex flex-col gap-0.5'>
                      <span className='font-bold'>${Number(value).toFixed(4)}</span>
                      <span className='text-xs text-muted-foreground'>{props.payload.time}</span>
                    </div>
                  )}
                />}
              />
              <Area 
                dataKey="price" 
                type="natural" 
                fill="url(#chartGradient)"
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={false}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
      
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Coins className="h-6 w-6 text-yellow-500" />
            <span>Coin Ratings</span>
          </CardTitle>
          <CardDescription>Live prices for popular cryptocurrencies. Click a coin to see its chart.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Coin</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right hidden sm:table-cell">Change (24h)</TableHead>
                <TableHead className="text-right hidden md:table-cell">% Change</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {coins.map((coin) => (
                <TableRow key={coin.symbol} onClick={() => setSelectedCoin(coin)} className="cursor-pointer">
                  <TableCell>
                    <div className="font-bold">{coin.name}</div>
                    <div className="text-xs text-muted-foreground">{coin.symbol}</div>
                  </TableCell>
                  <TableCell className="text-right font-mono">${coin.price.toFixed(2)}</TableCell>
                  <TableCell className={`text-right font-mono hidden sm:table-cell ${getChangeColor(coin.change)}`}>
                    {coin.change.toFixed(2)}
                  </TableCell>
                   <TableCell className={`text-right font-mono hidden md:table-cell ${getChangeColor(coin.change)}`}>
                    <div className="flex items-center justify-end gap-1">
                      <ChangeIcon change={coin.change} />
                      {((coin.change / (coin.price - coin.change)) * 100).toFixed(2)}%
                    </div>
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
