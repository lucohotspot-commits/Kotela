
"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TrendingUp, TrendingDown, Minus, Coins, Star, Settings, BarChart, Expand, LineChart as LineChartIcon, Search, GripVertical, PenLine, Sigma, Milestone } from 'lucide-react';
import { AreaChart, Area, ComposedChart, Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Line, Cell } from 'recharts';
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
import { useIsMobile } from '@/hooks/use-mobile';

type CoinData = {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  ma5?: number;
  ma10?: number;
  ma20?: number;
  volMa5?: number;
  volMa10?: number;
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

const calculateMovingAverage = (data: number[], period: number) => {
    if (data.length < period) return undefined;
    const sum = data.slice(-period).reduce((acc, val) => acc + val, 0);
    return sum / period;
};

function generateInitialCoinState(coin: Omit<Coin, 'history' | 'change' | 'high' | 'low' | 'volume'>[]): Coin[] {
    return coin.map(c => {
        const history: CoinData[] = [];
        let lastClose = c.price;

        for (let i = 0; i < 100; i++) {
            const open = lastClose;
            const change = (Math.random() - 0.5) * 0.05 * open;
            const close = open + change;
            const high = Math.max(open, close) * (1 + Math.random() * 0.02);
            const low = Math.min(open, close) * (1 - Math.random() * 0.02);
            const volume = Math.random() * 1000 + 100;
            const time = new Date(Date.now() - (100 - i) * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            const closes = history.map(h => h.close).concat(close);
            const volumes = history.map(h => h.volume).concat(volume);
            
            history.push({
                time, open, high, low, close, volume,
                ma5: calculateMovingAverage(closes, 5),
                ma10: calculateMovingAverage(closes, 10),
                ma20: calculateMovingAverage(closes, 20),
                volMa5: calculateMovingAverage(volumes, 5),
                volMa10: calculateMovingAverage(volumes, 10),
            });
            lastClose = close;
        }

        const prices = history.map(h => h.close);
        return {
            ...c,
            history,
            price: prices[prices.length - 1],
            change: prices.length > 1 ? prices[prices.length - 1] - history[0].open : 0,
            high: Math.max(...history.map(h => h.high)),
            low: Math.min(...history.map(h => h.low)),
            volume: history.reduce((acc, h) => acc + h.volume, 0),
        };
    });
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
  const [hoverData, setHoverData] = useState<CoinData | null>(null);
  const { currency } = useGame();
  const isMobile = useIsMobile();
  
  const [tradeState, setTradeState] = useState({
    buy: { price: '', amount: '', total: '' },
    sell: { price: '', amount: '', total: '' },
  });
  
  useEffect(() => {
    const initialCoins = generateInitialCoinState(initialCoinsData);
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
        const volume = Math.random() * 1000 + 100;
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        const newHistoryRaw = [...coin.history, { time, open, high, low, close, volume }].slice(-100);
        
        const newHistory = newHistoryRaw.map((h, i, arr) => {
            const closes = arr.slice(0, i + 1).map(d => d.close);
            const volumes = arr.slice(0, i + 1).map(d => d.volume);
            return {
                ...h,
                ma5: calculateMovingAverage(closes, 5),
                ma10: calculateMovingAverage(closes, 10),
                ma20: calculateMovingAverage(closes, 20),
                volMa5: calculateMovingAverage(volumes, 5),
                volMa10: calculateMovingAverage(volumes, 10),
            }
        });

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
  const mainChartDomain: [number, number] = useMemo(() => {
    if (!chartData || chartData.length === 0) return [0, 0];
    const prices = chartData.flatMap(d => [d.high, d.low, d.ma5, d.ma10, d.ma20]).filter(v => v !== undefined) as number[];
    if (prices.length === 0) return [0, 1];
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const padding = (max - min) * 0.2 || max * 0.1;
    return [Math.max(0, min - padding), max + padding];
  }, [chartData]);
  
  const volumeChartDomain: [number, number] = useMemo(() => {
    if (!chartData || chartData.length === 0) return [0, 1];
    const volumes = chartData.flatMap(d => [d.volume, d.volMa5, d.volMa10]).filter(v => v !== undefined) as number[];
    if (volumes.length === 0) return [0, 1];
    const max = Math.max(...volumes);
    return [0, max * 1.5];
  }, [chartData]);
  
  const handleChartMouseMove = (e: any) => {
    if (e && e.activePayload && e.activePayload.length > 0) {
      setHoverData(e.activePayload[0].payload);
    }
  };

  const handleChartMouseLeave = () => {
    setHoverData(null);
  };
  
  const chartElement = (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart 
        data={chartData} 
        margin={{ top: 0, right: isMobile ? 0 : 10, left: 0, bottom: 0 }}
        onMouseMove={handleChartMouseMove}
        onMouseLeave={handleChartMouseLeave}
      >
        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis
          dataKey="time"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value, index) => index % 15 === 0 ? value : ''}
          className="text-xs fill-muted-foreground"
          hide
        />
        <YAxis
          yAxisId="price"
          orientation="right"
          domain={mainChartDomain}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => `$${Number(value).toFixed(2)}`}
          className="text-xs fill-muted-foreground"
        />
        <Tooltip content={<div/>} cursor={{ stroke: 'hsl(var(--foreground))', strokeDasharray: '3 3' }} isAnimationActive={false} />

        {chartType === 'candlestick' ? (
          <Line yAxisId="price" type="linear" dataKey="close" stroke="transparent" dot={false} isAnimationActive={false} />
        ) : (
          <Line yAxisId="price" type="monotone" dataKey="close" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} isAnimationActive={false} />
        )}
        
        <Line yAxisId="price" type="monotone" dataKey="ma5" stroke="#facc15" strokeWidth={1} dot={false} isAnimationActive={false} />
        <Line yAxisId="price" type="monotone" dataKey="ma10" stroke="#8b5cf6" strokeWidth={1} dot={false} isAnimationActive={false} />
        <Line yAxisId="price" type="monotone" dataKey="ma20" stroke="#3b82f6" strokeWidth={1} dot={false} isAnimationActive={false} />
        
        {chartType === 'candlestick' && <Bar yAxisId="price" dataKey="close" barSize={1} isAnimationActive={false} shape={(props: any) => {
            const { x, y, width, height, payload } = props;
            if (x === undefined || y === undefined || width === undefined || height === undefined) return null;
            const isUp = payload.close >= payload.open;
            const color = isUp ? 'hsl(142.1 76.2% 36.3%)' : 'hsl(355.7 79.4% 45.1%)';
            const candleWidth = 6;
            const candleX = x + width / 2 - candleWidth / 2;
            const yAxis = props.yAxis;
            if (!yAxis) return null;

            const getClientY = (val: number) => yAxis.scale(val);

            const highY = getClientY(payload.high);
            const lowY = getClientY(payload.low);

            const bodyY = getClientY(Math.max(payload.open, payload.close));
            const bodyHeight = Math.max(1, Math.abs(getClientY(payload.open) - getClientY(payload.close)));

            return <>
              <line x1={candleX + candleWidth / 2} y1={highY} x2={candleX + candleWidth / 2} y2={lowY} stroke={color} strokeWidth={1} />
              <rect x={candleX} y={bodyY} width={candleWidth} height={bodyHeight} fill={color} />
            </>
          }} />}
      </ComposedChart>
    </ResponsiveContainer>
  );

  const volumeChartElement = (
      <ResponsiveContainer width="100%" height="100%">
          <ComposedChart 
            data={chartData} 
            margin={{ top: 10, right: isMobile ? 0 : 10, left: 0, bottom: 0 }}
            onMouseMove={handleChartMouseMove}
            onMouseLeave={handleChartMouseLeave}
          >
             <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="time"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value, index) => index % 15 === 0 ? value : ''}
                className="text-xs fill-muted-foreground"
            />
            <YAxis
                yAxisId="volume"
                orientation="right"
                domain={volumeChartDomain}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => `${(Number(value)/1000).toFixed(1)}k`}
                className="text-xs fill-muted-foreground"
            />
            <Tooltip content={<div />} cursor={{ stroke: 'hsl(var(--foreground))', strokeDasharray: '3 3' }} isAnimationActive={false} />
            <Bar yAxisId="volume" dataKey="volume" barSize={10} isAnimationActive={false}>
                {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.close >= entry.open ? 'hsla(142.1, 76.2%, 36.3%, 0.2)' : 'hsla(355.7, 79.4%, 45.1%, 0.2)'} />
                ))}
            </Bar>
            <Line yAxisId="volume" type="monotone" dataKey="volMa5" stroke="#facc15" strokeWidth={1} dot={false} isAnimationActive={false} />
            <Line yAxisId="volume" type="monotone" dataKey="volMa10" stroke="#8b5cf6" strokeWidth={1} dot={false} isAnimationActive={false} />
          </ComposedChart>
      </ResponsiveContainer>
  )

  const InfoBar = () => {
      const data = hoverData || (chartData.length > 0 ? chartData[chartData.length - 1] : null);
      if (!data) return <div className="h-6 text-xs text-muted-foreground p-2 flex items-center">Hover over the chart to see details</div>;

      const change = data.close - data.open;
      const changePercent = (change / data.open) * 100;
      
      const formatValue = (val: number | undefined, prefix = '') => val ? `${prefix}${val.toFixed(2)}` : 'N/A';

      return (
        <div className="text-xs text-muted-foreground p-2 flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="text-foreground">{data.time}</span>
            <span className="flex items-center gap-1">O<span className={getChangeColor(data.open - data.close)}>{formatValue(data.open)}</span></span>
            <span className="flex items-center gap-1">H<span className={getChangeColor(data.high - data.close)}>{formatValue(data.high)}</span></span>
            <span className="flex items-center gap-1">L<span className={getChangeColor(data.low - data.close)}>{formatValue(data.low)}</span></span>
            <span className="flex items-center gap-1">C<span className={getChangeColor(change)}>{formatValue(data.close)}</span></span>
            <span className={getChangeColor(change)}>{formatValue(changePercent)}%</span>
            <span className="text-yellow-400">{formatValue(data.ma5, 'MA5: ')}</span>
            <span className="text-purple-400">{formatValue(data.ma10, 'MA10: ')}</span>
            <span className="text-blue-400">{formatValue(data.ma20, 'MA20: ')}</span>
        </div>
      )
  };
  
  const DrawingToolbar = () => (
      <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 bg-card border-r border-t border-b rounded-r-md">
        <div className="flex flex-col items-center">
            <Button variant="ghost" size="icon" className="w-8 h-8 rounded-none"><GripVertical className="w-4 h-4" /></Button>
            <Separator />
            <Button variant="ghost" size="icon" className="w-8 h-8 rounded-none"><PenLine className="w-4 h-4" /></Button>
            <Button variant="ghost" size="icon" className="w-8 h-8 rounded-none"><Sigma className="w-4 h-4" /></Button>
            <Button variant="ghost" size="icon" className="w-8 h-8 rounded-none"><Milestone className="w-4 h-4" /></Button>
            <Button variant="ghost" size="icon" className="w-8 h-8 rounded-none"><Search className="w-4 h-4" /></Button>
        </div>
      </div>
  );


  if (!selectedCoin) {
      return <TradingInterfaceSkeleton />;
  }

  const chartSection = (
    <div className="space-y-0 relative">
        {!isMobile && <DrawingToolbar />}
        <header className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 p-2 border-b">
            <div className='flex items-center gap-2'>
                <h1 className="text-xl font-bold">{selectedCoin.symbol}/USDT</h1>
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
                    <TabsTrigger value="Time" className="text-xs p-1 data-[state=active]:bg-muted data-[state=active]:text-foreground data-[state=active]:shadow-none" disabled>Time</TabsTrigger>
                    <TabsTrigger value="1H" className="text-xs p-1 data-[state=active]:bg-muted data-[state=active]:text-foreground data-[state=active]:shadow-none">1H</TabsTrigger>
                    <TabsTrigger value="4H" className="text-xs p-1 data-[state=active]:bg-muted data-[state=active]:text-foreground data-[state=active]:shadow-none">4H</TabsTrigger>
                    <TabsTrigger value="1D" className="text-xs p-1 data-[state=active]:bg-muted data-[state=active]:text-foreground data-[state=active]:shadow-none">1D</TabsTrigger>
                    <TabsTrigger value="1W" className="text-xs p-1 data-[state=active]:bg-muted data-[state=active]:text-foreground data-[state=active]:shadow-none">1W</TabsTrigger>
                </TabsList>
            </Tabs>
            <div className="flex items-center gap-2 text-muted-foreground">
                <LineChartIcon className={cn("h-4 w-4 cursor-pointer hover:text-foreground", chartType === 'line' && 'text-foreground')} onClick={() => setChartType('line')} />
                <BarChart className={cn("h-4 w-4 cursor-pointer hover:text-foreground", chartType === 'candlestick' && 'text-foreground')} onClick={() => setChartType('candlestick')} />
                <Settings className="h-4 w-4 cursor-pointer hover:text-foreground" />
                <Dialog>
                    <DialogTrigger asChild>
                        <Expand className="h-4 w-4 cursor-pointer hover:text-foreground" />
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
        
        <InfoBar />

        <div className="w-full bg-transparent h-[250px] pr-2">
            {chartElement}
        </div>

        <div className='w-full h-[100px] border-t pr-2'>
            {volumeChartElement}
        </div>

         <Tabs defaultValue="vol" className="w-full border-t">
            <TabsList className="h-8 p-0 bg-transparent gap-2 px-2">
                <TabsTrigger value="main" className="text-xs p-1 data-[state=active]:text-foreground data-[state=active]:shadow-none data-[state=active]:border-b-2 border-primary rounded-none" disabled>Main</TabsTrigger>
                <TabsTrigger value="ma" className="text-xs p-1 data-[state=active]:text-foreground data-[state=active]:shadow-none data-[state=active]:border-b-2 border-primary rounded-none">MA</TabsTrigger>
                <TabsTrigger value="ema" className="text-xs p-1 data-[state=active]:text-foreground data-[state=active]:shadow-none data-[state=active]:border-b-2 border-primary rounded-none">EMA</TabsTrigger>
                <TabsTrigger value="boll" className="text-xs p-1 data-[state=active]:text-foreground data-[state=active]:shadow-none data-[state=active]:border-b-2 border-primary rounded-none">BOLL</TabsTrigger>
                <Separator orientation="vertical" className="h-4 self-center"/>
                <TabsTrigger value="sub" className="text-xs p-1 data-[state=active]:text-foreground data-[state=active]:shadow-none data-[state=active]:border-b-2 border-primary rounded-none" disabled>Sub</TabsTrigger>
                <TabsTrigger value="vol" className="text-xs p-1 data-[state=active]:text-foreground data-[state=active]:shadow-none data-[state=active]:border-b-2 border-primary rounded-none">VOL</TabsTrigger>
                <TabsTrigger value="macd" className="text-xs p-1 data-[state=active]:text-foreground data-[state=active]:shadow-none data-[state=active]:border-b-2 border-primary rounded-none">MACD</TabsTrigger>
            </TabsList>
        </Tabs>
        
        <div className="grid grid-cols-2 gap-4 p-4 mt-2">
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
                <Button className="w-full bg-red-600 hover:bg-red-700 text-white">Sell {selectedCoin.symbol}</Button>
            </div>
        </div>
    </div>
  );

  const marketListSection = (
      <div className="lg:col-span-3 space-y-0">
          <div className="border-b">
              <div className='p-2 flex items-center justify-between'>
                  <h3 className="font-semibold text-sm">Market</h3>
                  <div className="relative w-32">
                      <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                      <Input placeholder="Search" className="pl-6 h-7 text-xs" />
                  </div>
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
  );

  if (isMobile) {
      return (
        <Tabs defaultValue="chart" className="w-full">
            <TabsList className="grid w-full grid-cols-4 h-12 p-0 border-b rounded-none">
                <TabsTrigger value="chart">Chart</TabsTrigger>
                <TabsTrigger value="book">Order Book</TabsTrigger>
                <TabsTrigger value="market">Market</TabsTrigger>
                <TabsTrigger value="trades">Trades</TabsTrigger>
            </TabsList>
            <TabsContent value="chart">{chartSection}</TabsContent>
            <TabsContent value="book"><OrderBook selectedCoin={selectedCoin} /></TabsContent>
            <TabsContent value="market">{marketListSection}</TabsContent>
            <TabsContent value="trades"><MarketTrades selectedCoin={selectedCoin} /></TabsContent>
        </Tabs>
      )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border rounded-lg bg-card text-card-foreground shadow-sm">
        <div className="lg:col-span-3 hidden lg:block">
            <OrderBook selectedCoin={selectedCoin} />
        </div>
        <div className="lg:col-span-6 border-l border-r">
            {chartSection}
        </div>
        {marketListSection}
    </div>
  );
}

    