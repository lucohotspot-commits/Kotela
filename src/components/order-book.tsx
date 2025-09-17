
"use client";

import { useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

type Coin = {
    name: string;
    symbol: string;
    price: number;
    change: number;
};

interface OrderBookProps {
    selectedCoin: Coin;
}

export function OrderBook({ selectedCoin }: OrderBookProps) {
    const { sellOrders, buyOrders } = useMemo(() => {
        const generateOrders = (count: number, isSell: boolean) => {
            return [...Array(count)].map((_, i) => {
                const price = selectedCoin.price * (1 + (isSell ? 1 : -1) * (Math.random() - 0.45) * 0.01 * (i + 1));
                const amount = Math.random() * 2;
                return {
                    price: price,
                    amount: amount,
                    total: price * amount,
                };
            });
        };
        return {
            sellOrders: generateOrders(15, true).sort((a,b) => b.price - a.price),
            buyOrders: generateOrders(15, false).sort((a,b) => b.price - a.price),
        };
    }, [selectedCoin.price]);

    const getChangeColor = (change: number) => {
        if (change > 0) return 'text-green-500';
        if (change < 0) return 'text-red-500';
        return 'text-muted-foreground';
    };

    return (
        <Card className="w-full h-full">
            <CardHeader className='p-2 border-b'>
                <CardTitle className="text-sm">Order Book</CardTitle>
            </CardHeader>
            <CardContent className='p-0'>
                <Table>
                    <TableHeader>
                        <TableRow className='h-8'>
                            <TableHead className="text-xs h-auto px-2">Price(USDT)</TableHead>
                            <TableHead className="text-xs h-auto px-2 text-right">Amount({selectedCoin.symbol})</TableHead>
                            <TableHead className="text-xs h-auto px-2 text-right">Total</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sellOrders.map((order, i) => (
                            <TableRow key={`sell-${i}`} className='h-7'>
                                <TableCell className="py-0 px-2 text-xs text-red-500">{order.price.toFixed(4)}</TableCell>
                                <TableCell className="py-0 px-2 text-xs text-right">{order.amount.toFixed(4)}</TableCell>
                                <TableCell className="py-0 px-2 text-xs text-right">{order.total.toFixed(4)}</TableCell>
                            </TableRow>
                        ))}
                        <TableRow className='h-9'>
                            <TableCell colSpan={3} className={`py-1 px-2 text-base font-bold text-center ${getChangeColor(selectedCoin.change)}`}>
                                {selectedCoin.price.toFixed(4)}
                            </TableCell>
                        </TableRow>
                        {buyOrders.map((order, i) => (
                            <TableRow key={`buy-${i}`} className='h-7'>
                                <TableCell className="py-0 px-2 text-xs text-green-500">{order.price.toFixed(4)}</TableCell>
                                <TableCell className="py-0 px-2 text-xs text-right">{order.amount.toFixed(4)}</TableCell>
                                <TableCell className="py-0 px-2 text-xs text-right">{order.total.toFixed(4)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
