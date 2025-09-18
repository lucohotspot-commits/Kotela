
"use client";

import { useState, useEffect, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from './ui/scroll-area';

type Coin = {
    price: number;
    symbol: string;
};

type Trade = {
    price: number;
    amount: number;
    time: string;
    type: 'buy' | 'sell';
};

interface MarketTradesProps {
    selectedCoin: Coin;
}

export function MarketTrades({ selectedCoin }: MarketTradesProps) {
    const [trades, setTrades] = useState<Trade[]>([]);

    useEffect(() => {
        const generateInitialTrades = () => {
            const initialTrades: Trade[] = [];
            for (let i = 0; i < 20; i++) {
                const price = selectedCoin.price * (1 + (Math.random() - 0.5) * 0.001);
                const amount = Math.random() * 0.1;
                const time = new Date(Date.now() - Math.random() * 10000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
                const type = Math.random() > 0.5 ? 'buy' : 'sell';
                initialTrades.push({ price, amount, time, type });
            }
            return initialTrades.sort((a,b) => b.time.localeCompare(a.time));
        };
        setTrades(generateInitialTrades());
    }, [selectedCoin.price]);
    
    useEffect(() => {
        const interval = setInterval(() => {
            setTrades(prevTrades => {
                const newTrade: Trade = {
                    price: selectedCoin.price * (1 + (Math.random() - 0.5) * 0.001),
                    amount: Math.random() * 0.1,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }),
                    type: Math.random() > 0.5 ? 'buy' : 'sell'
                };
                const updatedTrades = [newTrade, ...prevTrades].slice(0, 20);
                return updatedTrades.sort((a,b) => b.time.localeCompare(a.time));
            });
        }, 2500);

        return () => clearInterval(interval);
    }, [selectedCoin.price]);

    const getPriceColor = (type: 'buy' | 'sell') => {
        return type === 'buy' ? 'text-green-500' : 'text-red-500';
    };

    return (
        <div>
            <ScrollArea className='h-[calc(100vh-17rem)]'>
                <Table>
                    <TableHeader>
                        <TableRow className='h-8'>
                            <TableHead className="text-xs h-auto px-2">Price(USDT)</TableHead>
                            <TableHead className="text-xs h-auto px-2 text-right">Amount({selectedCoin.symbol})</TableHead>
                            <TableHead className="text-xs h-auto px-2 text-right">Time</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {trades.map((trade, i) => (
                            <TableRow key={i} className='h-7'>
                                <TableCell className={`py-0 px-2 text-xs ${getPriceColor(trade.type)}`}>{trade.price.toFixed(4)}</TableCell>
                                <TableCell className="py-0 px-2 text-xs text-right">{trade.amount.toFixed(4)}</TableCell>
                                <TableCell className="py-0 px-2 text-xs text-right text-muted-foreground">{trade.time}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </ScrollArea>
        </div>
    );
}
