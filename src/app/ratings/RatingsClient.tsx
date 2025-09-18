
"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TrendingUp, TrendingDown, Minus, Coins, Star, Settings, BarChart, Expand, LineChart as LineChartIcon } from 'lucide-react';
import { ComposedChart, Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Line, Cell } from 'recharts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { OrderBook } from '@/components/order-book';
import { MarketTrades } from '@/components/market-trades';
import { TopMovers } from '@/components/top-movers';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from '@/lib/utils';
import { EconomicCalendar } from '@/components/economic-calendar';
import { useGame } from '@/context/GameContext';
import { Skeleton } from '@/components/ui/skeleton';

type CoinData = {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

type Coin = {
  name: string;
  symbol: string;
  price: number;
  change: number;
  high: number;
  low: number;
  volume: number;
  history: CoinData[];
};

type ChartType = 'candlestick' | 'line';

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
    const history: CoinData[] = [];
    let lastClose = coin.price;

    for (let i = 0; i < 30; i++) {
        const open = lastClose;
        const change = (Math.random() - 0.5) * 0.05 * open;
        const close = open + change;
        const high = Math.max(open, close) * (1 + Math.random() * 0.02);
        const low = Math.min(open, close) * (1 - Math.random() * 0.02);
        const volume = Math.random() * 1000;
        const time = new Date(Date.now() - (30 - i) * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        history.push({ time, open, high, low, close, volume });
        lastClose = close;
    }

    const prices = history.map(h => h.close);
    return {
        ...coin,
        history,
        price: prices[prices.length - 1],
        change: prices.length > 1 ? prices[prices.length - 1] - history[0].open : 0,
        high: Math.max(...history.map(h => h.high)),
        low: Math.min(...history.map(h => h.low)),
        volume: history.reduce((acc, h) => acc + h.volume, 0),
    };
}


const TradingInterfaceSkeleton = () => (
  <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 animate-pulse">
      <div className="lg:col-span-3 hidden lg:block border-r">
          <div className='p-2 border-b'>
              <Skeleton className="h-5 w-2/4" />
          </div>
          <div className="p-2 space-y-2">
              {Array.from({ length: 15 }).map((_, i) => (
                  <div key={i} className="flex justify-between gap-4">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-4 w-1/3" />
                  </div>
              ))}
              <div className="flex justify-center py-2">
                  <Skeleton className="h-6 w-1/2" />
              </div>
              {Array.from({ length: 15 }).map((_, i) => (
                  <div key={i+15} className="flex justify-between gap-4">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-4 w-1/3" />
                  </div>
              ))}
          </div>
      </div>
      <div className="lg:col-span-6 space-y-0">
          <header className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 p-2 border-b">
              <Skeleton className="h-7 w-24" />
              <Skeleton className="h-7 w-20" />
              <div className='text-xs space-y-1'>
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-28" />
              </div>
               <div className='text-xs space-y-1'>
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-40" />
              </div>
          </header>
          <div className="p-2 border-b">
              <Skeleton className="h-6 w-3/4" />
          </div>

          <div className="w-full bg-transparent h-[250px] py-4 px-2">
              <Skeleton className="h-full w-full" />
          </div>
          
          <Separator />
          
          <div className="grid grid-cols-2 gap-4 p-4 mt-4">
              <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-9 w-full" />
                  <Skeleton className="h-9 w-full" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-9 w-full" />
                  <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-9 w-full" />
                  <Skeleton className="h-9 w-full" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-9 w-full" />
                  <Skeleton className="h-10 w-full" />
              </div>
          </div>
      </div>
      <div className="lg:col-span-3 space-y-0 border-l">
          <div className="border-b p-2">
              <Skeleton className="h-5 w-1/3" />
          </div>
          <div className="p-2 space-y-2">
              {Array.from({ length: 10 }).map((_, i) => (
                   <div key={i} className="flex justify-between items-center gap-2">
                      <Skeleton className="h-4 w-1/4" />
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-4 w-1/4" />
                  </div>
              ))}
          </div>
          <div className="border-b p-2">
              <Skeleton className="h-8 w-full" />
          </div>
          <div className="p-4 text-center text-sm text-muted-foreground">
              <Skeleton className="h-24 w-full" />
          </div>
      </div>
  </div>
);


export default function RatingsClient() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);
  const [chartType, setChartType] = useState<ChartType>('candlestick');
  const { currency } = useGame();
  
  const [tradeState, setTradeState] = useState({
    buy: { price: '', amount: '', total: '' },
    sell: { price: '', amount: '', total: '' },
  });
  
  useEffect(() => {
    const initialCoins = initialCoinsData.map(generateInitialCoinState);
    setCoins(initialCoins);
    const ktcCoin = initialCoins.find(c => c.symbol === 'KTC') || initialCoins[0];
    setSelectedCoin(ktcCoin);
     setTradeState(prevState => ({
      ...prevState,
      buy: { ...prevState.buy, price: ktcCoin.price.toFixed(4) },
      sell: { ...prevState.sell, price: ktcCoin.price.toFixed(4) }
    }));
  }, []);
  
  useEffect(() => {
    if (selectedCoin) {
        setTradeState(prevState => ({
            buy: { ...prevState.buy, price: selectedCoin.price.toFixed(4), amount: '', total: '' },
            sell: { ...prevState.sell, price: selectedCoin.price.toFixed(4), amount: '', total: '' },
        }));
    }
  }, [selectedCoin?.symbol]);

  const handleTradeInputChange = (side: 'buy' | 'sell', field: 'price' | 'amount' | 'total', value: string) => {
    const numericValue = parseFloat(value);
    
    setTradeState(prevState => {
        const newState = { ...prevState };
        let { price, amount, total } = newState[side];
        
        if (field === 'price') price = value;
        if (field === 'amount') amount = value;
        if (field === 'total') total = value;

        const numPrice = parseFloat(price);
        const numAmount = parseFloat(amount);
        const numTotal = parseFloat(total);

        if (field === 'amount') {
            if (!isNaN(numPrice) && !isNaN(numAmount)) {
                total = (numPrice * numAmount).toFixed(4);
            }
        } else if (field === 'price') {
             if (!isNaN(numPrice) && !isNaN(numAmount)) {
                total = (numPrice * numAmount).toFixed(4);
            }
        } else if (field === 'total') {
            if (!isNaN(numPrice) && numPrice > 0 && !isNaN(numTotal)) {
                amount = (numTotal / numPrice).toFixed(8);
            }
        }
        
        return { ...prevState, [side]: { price, amount, total } };
    });
  };
  
  const handleSliderChange = (side: 'buy' | 'sell', value: number[]) => {
      const percentage = value[0] / 100;
      const numPrice = parseFloat(tradeState[side].price);

      if(side === 'buy') {
          if (!isNaN(numPrice) && numPrice > 0) {
              const total = (currency * percentage).toFixed(4);
              const amount = (parseFloat(total) / numPrice).toFixed(8);
              setTradeState(prev => ({...prev, buy: { ...prev.buy, amount, total }}));
          }
      } else { // sell
          const coinBalance = selectedCoin?.symbol === 'KTC' ? currency : 0; // Assume KTC balance for now
          const amount = (coinBalance * percentage).toFixed(8);
          setTradeState(prev => ({...prev, sell: { ...prev.sell, amount, total: (!isNaN(numPrice) ? (parseFloat(amount) * numPrice).toFixed(4) : '') }}));
      }
  };


  const updateCoinData = useCallback(() => {
    setCoins(prevCoins =>
      prevCoins.map(coin => {
        if (!coin.history || coin.history.length === 0) return coin;
        
        const lastData = coin.history[coin.history.length - 1];
        const open = lastData.close;
        const change = (Math.random() - 0.5) * 0.05 * open;
        const close = open + change;
        const high = Math.max(open, close) * (1 + Math.random() * 0.02);
        const low = Math.min(open, close) * (1 - Math.random() * 0.02);
        const volume = Math.random() * 1000;
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        const newHistory: CoinData[] = [...coin.history, { time, open, high, low, close, volume }].slice(-30);
        
        const prices = newHistory.map(h => h.close);
        const firstOpen = newHistory[0].open;

        const updatedCoin: Coin = {
          ...coin,
          price: close,
          change: close - firstOpen,
          history: newHistory,
          high: Math.max(...newHistory.map(h => h.high)),
          low: Math.min(...newHistory.map(h => h.low)),
          volume: newHistory.reduce((acc, h) => acc + h.volume, 0),
        };
        
        if (selectedCoin && coin.symbol === selectedCoin.symbol) {
          setSelectedCoin(updatedCoin);
        }

        return updatedCoin;
      })
    );
  }, [selectedCoin]);


  useEffect(() => {
    if (coins.length > 0) {
        const interval = setInterval(updateCoinData, 2000);
        return () => clearInterval(interval);
    }
  }, [updateCoinData, coins]);

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
    const prices = chartData.map(d => d.high).concat(chartData.map(d => d.low));
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const padding = (max - min) * 0.2 || max * 0.1;
    return [Math.max(0, min - padding), max + padding];
  }, [chartData]);
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="p-2 text-xs bg-background/90 border-none text-foreground">
          <p>{`Time: ${label}`}</p>
          <p className="text-green-500">{`Open: ${data.open.toFixed(4)}`}</p>
          <p className="text-green-500">{`High: ${data.high.toFixed(4)}`}</p>
          <p className="text-red-500">{`Low: ${data.low.toFixed(4)}`}</p>
          <p className={data.close > data.open ? 'text-green-500' : 'text-red-500'}>{`Close: ${data.close.toFixed(4)}`}</p>
          <p>{`Volume: ${data.volume.toFixed(2)}`}</p>
        </div>
      );
    }
    return null;
  };
  
  const chartElement = (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={chartData}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis
          dataKey="time"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value, index) => index % 5 === 0 ? value : ''}
          className="text-xs fill-muted-foreground"
        />
        <YAxis
          yAxisId="price"
          orientation="right"
          domain={chartDomain}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => `$${Number(value).toFixed(2)}`}
          className="text-xs fill-muted-foreground"
        />
        <YAxis yAxisId="volume" orientation="right" domain={[0, 'dataMax * 4']} tickLine={false} axisLine={false} tick={false} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted))' }} />

        {chartType === 'candlestick' ? (
          <Bar yAxisId="price" dataKey="close" barSize={1} shape={(props) => {
            const { x, y, width, height, payload } = props;
            if (x === undefined || y === undefined || width === undefined || height === undefined) return null;
            const isUp = payload.close > payload.open;
            const color = isUp ? 'hsl(var(--chart-2))' : 'hsl(var(--chart-5))';
            const candleWidth = 4;
            const candleX = x + width / 2 - candleWidth / 2;

            const yAxis = props.yAxis;
            if (!yAxis) return null;

            const getClientY = (val: number) => yAxis.scale(val);

            const highY = getClientY(payload.high);
            const lowY = getClientY(payload.low);

            const bodyY = getClientY(Math.max(payload.open, payload.close));
            const bodyHeight = Math.abs(getClientY(payload.open) - getClientY(payload.close));

            return <>
              <line x1={candleX + candleWidth / 2} y1={highY} x2={candleX + candleWidth / 2} y2={lowY} stroke={color} strokeWidth={1} />
              <rect x={candleX} y={bodyY} width={candleWidth} height={bodyHeight} fill={color} />
            </>
          }} />
        ) : (
          <Line yAxisId="price" type="monotone" dataKey="close" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
        )}

        <Bar yAxisId="volume" dataKey="volume" barSize={10} >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.close > entry.open ? 'hsla(var(--chart-2), 0.2)' : 'hsla(var(--chart-5), 0.2)'} />
          ))}
        </Bar>
      </ComposedChart>
    </ResponsiveContainer>
  );


  if (!selectedCoin) {
      return <TradingInterfaceSkeleton />;
  }


  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        <div className="lg:col-span-3 hidden lg:block">
            <OrderBook selectedCoin={selectedCoin} />
        </div>
        <div className="lg:col-span-6 space-y-0">
            <header className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 p-2 border-b">
                <div className='flex items-center gap-2'>
                    <h1 className="text-xl font-bold">{selectedCoin.symbol}/USDT</h1>
                    <p className='text-xs text-muted-foreground'>{selectedCoin.name}</p>
                </div>
                <p className={`text-xl font-bold ${getChangeColor(selectedCoin.change)}`}>${selectedCoin.price.toFixed(4)}</p>
                <div className='text-xs space-y-0.5'>
                    <p><span className='text-muted-foreground'>24h Change:</span> <span className={getChangeColor(selectedCoin.change)}>{selectedCoin.change.toFixed(4)} {((selectedCoin.change / (selectedCoin.price - selectedCoin.change)) * 100).toFixed(2)}%</span></p>
                    <p><span className='text-muted-foreground'>24h High:</span> <span>${selectedCoin.high.toFixed(4)}</span></p>
                </div>
                 <div className='text-xs space-y-0.5'>
                    <p><span className='text-muted-foreground'>24h Low:</span> <span>${selectedCoin.low.toFixed(4)}</span></p>
                    <p><span className='text-muted-foreground'>24h Volume({selectedCoin.symbol}):</span> <span>{selectedCoin.volume.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span></p>
                </div>
            </header>
            
            <div className="flex items-center justify-between gap-2 p-2 border-b">
                <Tabs defaultValue="1H" className="w-full">
                    <TabsList className="h-auto p-0 bg-transparent gap-2">
                        <TabsTrigger value="Time" className="text-xs p-1 data-[state=active]:bg-muted data-[state=active]:text-primary data-[state=active]:shadow-none" disabled>Time</TabsTrigger>
                        <TabsTrigger value="1H" className="text-xs p-1 data-[state=active]:bg-muted data-[state=active]:text-primary data-[state=active]:shadow-none">1H</TabsTrigger>
                        <TabsTrigger value="4H" className="text-xs p-1 data-[state=active]:bg-muted data-[state=active]:text-primary data-[state=active]:shadow-none">4H</TabsTrigger>
                        <TabsTrigger value="1D" className="text-xs p-1 data-[state=active]:bg-muted data-[state=active]:text-primary data-[state=active]:shadow-none">1D</TabsTrigger>
                        <TabsTrigger value="1W" className="text-xs p-1 data-[state=active]:bg-muted data-[state=active]:text-primary data-[state=active]:shadow-none">1W</TabsTrigger>
                    </TabsList>
                </Tabs>
                <div className="flex items-center gap-2 text-muted-foreground">
                    <LineChartIcon className={cn("h-4 w-4 cursor-pointer hover:text-primary", chartType === 'line' && 'text-primary')} onClick={() => setChartType('line')} />
                    <BarChart className={cn("h-4 w-4 cursor-pointer hover:text-primary", chartType === 'candlestick' && 'text-primary')} onClick={() => setChartType('candlestick')} />
                    <Settings className="h-4 w-4 cursor-pointer hover:text-primary" />
                    <Dialog>
                        <DialogTrigger asChild>
                            <Expand className="h-4 w-4 cursor-pointer hover:text-primary" />
                        </DialogTrigger>
                        <DialogContent className="max-w-[90vw] h-[90vh] p-1">
                            <DialogHeader className="sr-only">
                                <DialogTitle>Expanded Chart View</DialogTitle>
                            </DialogHeader>
                            {chartElement}
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="w-full bg-transparent h-[250px] p-4">
                {chartElement}
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-2 gap-4 p-4 mt-4">
                 {/* Buy Form */}
                <div className="space-y-2">
                    <p className='text-xs text-muted-foreground'>Avbl: {currency.toFixed(2)} USDT</p>
                    <div className='relative'>
                        <Input type="number" placeholder='Price' value={tradeState.buy.price} onChange={e => handleTradeInputChange('buy', 'price', e.target.value)} className='pr-16' />
                        <span className='absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground'>USDT</span>
                    </div>
                    <div className='relative'>
                        <Input type="number" placeholder='Amount' value={tradeState.buy.amount} onChange={e => handleTradeInputChange('buy', 'amount', e.target.value)} className='pr-16' />
                        <span className='absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground'>{selectedCoin.symbol}</span>
                    </div>
                     <Slider 
                        defaultValue={[0]} 
                        max={100} 
                        step={1} 
                        onValueChange={(value) => handleSliderChange('buy', value)} 
                     />
                    <div className='relative'>
                        <Input type="number" placeholder='Total' value={tradeState.buy.total} onChange={e => handleTradeInputChange('buy', 'total', e.target.value)} className='pr-16' />
                         <span className='absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground'>USDT</span>
                    </div>
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white">Buy {selectedCoin.symbol}</Button>
                </div>

                {/* Sell Form */}
                <div className="space-y-2">
                    <p className='text-xs text-muted-foreground'>Avbl: {(selectedCoin.symbol === 'KTC' ? currency : 0).toFixed(4)} {selectedCoin.symbol}</p>
                    <div className='relative'>
                        <Input type="number" placeholder='Price' value={tradeState.sell.price} onChange={e => handleTradeInputChange('sell', 'price', e.target.value)} className='pr-16' />
                        <span className='absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground'>USDT</span>
                    </div>
                    <div className='relative'>
                        <Input type="number" placeholder='Amount' value={tradeState.sell.amount} onChange={e => handleTradeInputChange('sell', 'amount', e.target.value)} className='pr-16' />
                        <span className='absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground'>{selectedCoin.symbol}</span>
                    </div>
                    <Slider 
                        defaultValue={[0]} 
                        max={100} 
                        step={1} 
                        onValueChange={(value) => handleSliderChange('sell', value)}
                    />
                     <div className='relative'>
                        <Input type="number" placeholder='Total' value={tradeState.sell.total} onChange={e => handleTradeInputChange('sell', 'total', e.target.value)} className='pr-16' />
                        <span className='absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground'>USDT</span>
                    </div>
                    <Button className="w-full" variant="destructive">Sell {selectedCoin.symbol}</Button>
                </div>
            </div>
            
            <Separator />
            <div className="lg:hidden">
              <OrderBook selectedCoin={selectedCoin} />
            </div>
        </div>
        <div className="lg:col-span-3 space-y-0 border-l">
            <div className="border-b">
                <div className='p-2'>
                    <h3 className="font-semibold text-sm">Market</h3>
                </div>
                <ScrollArea className='h-[270px]'>
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
                                {coin.change > 0 ? '+' : ''}{((coin.change / (selectedCoin.price - selectedCoin.change)) * 100).toFixed(2)}%
                            </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </ScrollArea>
            </div>

            <Tabs defaultValue="trades" className="w-full">
                <TabsList className="grid w-full grid-cols-3 h-9 p-0 border-b">
                    <TabsTrigger value="trades" className="text-xs h-full rounded-none data-[state=active]:bg-muted data-[state=active]:shadow-none">Market Trades</TabsTrigger>
                    <TabsTrigger value="movers" className="text-xs h-full rounded-none data-[state=active]:bg-muted data-[state=active]:shadow-none">Top Movers</TabsTrigger>
                    <TabsTrigger value="calendar" className="text-xs h-full rounded-none data-[state=active]:bg-muted data-[state=active]:shadow-none">Calendar</TabsTrigger>
                </TabsList>
                <TabsContent value="trades">
                    <MarketTrades selectedCoin={selectedCoin} />
                </TabsContent>
                <TabsContent value="movers">
                    <TopMovers />
                </TabsContent>
                <TabsContent value="calendar">
                    <EconomicCalendar />
                </TabsContent>
            </Tabs>

        </div>
    </div>
  );
}
