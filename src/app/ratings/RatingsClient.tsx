
"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TrendingUp, TrendingDown, Minus, Coins, Star } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { OrderBook } from '@/components/order-book';

type Coin = {
  name: string;
  symbol: string;
  price: number;
  change: number;
  high: number;
  low: number;
  volume: number;
  history: { time: string; price: number }[];
};

const initialCoinsData: Omit<Coin, 'history' | 'change' | 'high' | 'low' | 'volume'>[] = [
  { name: 'Bitcoin', symbol: 'BTC', price: 68000 },
  { name: 'Ethereum', symbol: 'ETH', price: 3500 },
  { name: 'Solana', symbol: 'SOL', price: 150 },
  { name: 'Dogecoin', symbol: 'DOGE', price: 0.15 },
  { name: 'Kotela Coin', symbol: 'KTC', price: 1.00 },
  { name: 'Cardano', symbol: 'ADA', price: 0.45 },
  { name: 'Ripple', symbol: 'XRP', price: 0.52 },
];

function generateInitialCoinState(coin: Omit<Coin, 'history' | 'change' | 'high' | 'low' | 'volume'>): Coin {
    const history = Array.from({ length: 30 }, (_, i) => {
        const price = coin.price * (1 + (Math.random() - 0.5) * 0.02);
        return { time: new Date(Date.now() - (30 - i) * 2000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }), price };
    });
    const prices = history.map(h => h.price);
    return {
        ...coin,
        history,
        price: prices[prices.length - 1],
        change: prices.length > 1 ? prices[prices.length - 1] - prices[0] : 0,
        high: Math.max(...prices),
        low: Math.min(...prices),
        volume: Math.random() * 1000000,
    };
}


export default function RatingsClient() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);

  useEffect(() => {
    const initialCoins = initialCoinsData.map(generateInitialCoinState);
    setCoins(initialCoins);
    setSelectedCoin(initialCoins.find(c => c.symbol === 'KTC') || initialCoins[0]);
  }, []);

  const updateCoinData = useCallback(() => {
    setCoins(prevCoins =>
      prevCoins.map(coin => {
        if (!coin.history || coin.history.length === 0) return coin;
        
        const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const changeFactor = Math.random() * 0.02 - 0.01; // Fluctuate by up to 1%
        const newPrice = Math.max(0.01, coin.price * (1 + changeFactor));
        const newHistory = [...coin.history, { time: now, price: newPrice }].slice(-30);
        
        const prices = newHistory.map(h => h.price);
        const firstPrice = newHistory[0].price;

        const updatedCoin = {
          ...coin,
          price: newPrice,
          change: newPrice - firstPrice,
          history: newHistory,
          high: Math.max(...prices),
          low: Math.min(...prices),
          volume: coin.volume + Math.random() * 1000,
        };
        
        if (selectedCoin && coin.symbol === selectedCoin.symbol) {
          setSelectedCoin(updatedCoin);
        }

        return updatedCoin;
      })
    );
  }, [selectedCoin]);


  useEffect(() => {
    if (coins.length === 0) return;
    const interval = setInterval(updateCoinData, 2000);
    return () => clearInterval(interval);
  }, [updateCoinData, coins.length]);

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

  const chartData = useMemo(() => selectedCoin?.history || [], [selectedCoin]);
  const chartDomain: [number, number] = useMemo(() => {
    if (!chartData || chartData.length === 0) return [0, 0];
    const prices = chartData.map(d => d.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const padding = (max - min) * 0.2 || max * 0.1;
    return [Math.max(0, min - padding), max + padding];
  }, [chartData]);


  if (!selectedCoin) {
      return (
        <div className="flex items-center justify-center h-96">
            <p>Loading market data...</p>
        </div>
      );
  }


  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-2">
        <div className="lg:col-span-3 hidden lg:block">
            <OrderBook selectedCoin={selectedCoin} />
        </div>
        <div className="lg:col-span-6 space-y-2">
            <header className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b pb-2">
                <div>
                    <h1 className="text-xl font-bold">{selectedCoin.symbol}/USDT</h1>
                    <p className='text-xs text-muted-foreground'>{selectedCoin.name}</p>
                </div>
                <div>
                    <p className={`text-xl font-bold ${getChangeColor(selectedCoin.change)}`}>${selectedCoin.price.toFixed(4)}</p>
                </div>
                <div className='text-xs space-y-0.5'>
                    <p><span className='text-muted-foreground'>24h Change:</span> <span className={getChangeColor(selectedCoin.change)}>{selectedCoin.change.toFixed(4)} {((selectedCoin.change / (selectedCoin.price - selectedCoin.change)) * 100).toFixed(2)}%</span></p>
                    <p><span className='text-muted-foreground'>24h High:</span> <span>${selectedCoin.high.toFixed(4)}</span></p>
                </div>
                 <div className='text-xs space-y-0.5'>
                    <p><span className='text-muted-foreground'>24h Low:</span> <span>${selectedCoin.low.toFixed(4)}</span></p>
                    <p><span className='text-muted-foreground'>24h Volume({selectedCoin.symbol}):</span> <span>{selectedCoin.volume.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span></p>
                </div>
            </header>
            <Card className="w-full">
                <CardContent className="p-0 sm:p-1">
                <ChartContainer config={{
                    price: { label: 'Price', color: 'hsl(var(--primary))' },
                }} className="h-[250px] w-full">
                    <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
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
                        className="text-xs"
                    />
                    <YAxis 
                        domain={chartDomain}
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tickFormatter={(value) => `$${Number(value).toFixed(2)}`}
                        width={80}
                        className="text-xs"
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
            
            <div className="grid grid-cols-2 gap-2">
                {/* Buy Form */}
                <div className="space-y-2">
                    <p className='text-xs text-muted-foreground'>Avbl: 0.00000000 USDT</p>
                    <div className='relative'>
                        <Input type="text" placeholder='Price' defaultValue={selectedCoin.price.toFixed(4)} className='pr-16' />
                        <span className='absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground'>USDT</span>
                    </div>
                    <div className='relative'>
                        <Input type="number" placeholder='Amount' className='pr-16' />
                        <span className='absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground'>{selectedCoin.symbol}</span>
                    </div>
                    <Slider defaultValue={[50]} max={100} step={1} />
                    <div className='relative'>
                        <Input type="number" placeholder='Total' className='pr-16' />
                         <span className='absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground'>USDT</span>
                    </div>
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white">Buy {selectedCoin.symbol}</Button>
                </div>

                {/* Sell Form */}
                <div className="space-y-2">
                    <p className='text-xs text-muted-foreground'>Avbl: 0.00000000 {selectedCoin.symbol}</p>
                    <div className='relative'>
                        <Input type="text" placeholder='Price' defaultValue={selectedCoin.price.toFixed(4)} className='pr-16' />
                        <span className='absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground'>USDT</span>
                    </div>
                    <div className='relative'>
                        <Input type="number" placeholder='Amount' className='pr-16' />
                        <span className='absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground'>{selectedCoin.symbol}</span>
                    </div>
                    <Slider defaultValue={[50]} max={100} step={1} />
                     <div className='relative'>
                        <Input type="number" placeholder='Total' className='pr-16' />
                        <span className='absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground'>USDT</span>
                    </div>
                    <Button className="w-full" variant="destructive">Sell {selectedCoin.symbol}</Button>
                </div>
            </div>

        </div>
        <div className="lg:col-span-3">
             <Card className="w-full h-full">
                <CardHeader className='p-2 border-b'>
                <CardTitle className="flex items-center gap-2 text-sm">
                    <span>Market</span>
                </CardTitle>
                </CardHeader>
                <CardContent className='p-0'>
                <Table>
                    <TableHeader>
                    <TableRow className='h-8'>
                        <TableHead className="text-xs h-auto p-2">Pair</TableHead>
                        <TableHead className="text-xs h-auto p-2 text-right">Price</TableHead>
                        <TableHead className="text-xs h-auto p-2 text-right">% Change</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {coins.map((coin) => (
                        <TableRow key={coin.symbol} onClick={() => setSelectedCoin(coin)} className="cursor-pointer hover:bg-muted/50 h-8">
                        <TableCell className='py-1 px-2'>
                            <div className="flex items-center gap-2">
                                <Star className={`h-3 w-3 ${coin.symbol === selectedCoin.symbol ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground/50'}`}/>
                                <div className="font-bold text-xs">{coin.symbol}/USDT</div>
                            </div>
                        </TableCell>
                        <TableCell className="text-right font-mono text-xs py-1 px-2">${coin.price.toFixed(4)}</TableCell>
                        <TableCell className={`text-right font-mono text-xs py-1 px-2 ${getChangeColor(coin.change)}`}>
                            {coin.change > 0 ? '+' : ''}{((coin.change / (coin.price - coin.change)) * 100).toFixed(2)}%
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
