
"use client";

import { useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

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
        <div className="border rounded-lg h-full">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-xs h-8">Price(USDT)</TableHead>
                        <TableHead className="text-xs h-8 text-right">Amount({selectedCoin.symbol})</TableHead>
                        <TableHead className="text-xs h-8 text-right">Total</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sellOrders.map((order, i) => (
                        <TableRow key={`sell-${i}`}>
                            <TableCell className="py-1 text-xs text-red-500">{order.price.toFixed(4)}</TableCell>
                            <TableCell className="py-1 text-xs text-right">{order.amount.toFixed(4)}</TableCell>
                            <TableCell className="py-1 text-xs text-right">{order.total.toFixed(4)}</TableCell>
                        </TableRow>
                    ))}
                    <TableRow>
                        <TableCell colSpan={3} className={`py-2 text-lg font-bold text-center ${getChangeColor(selectedCoin.change)}`}>
                            {selectedCoin.price.toFixed(4)}
                        </TableCell>
                    </TableRow>
                    {buyOrders.map((order, i) => (
                        <TableRow key={`buy-${i}`}>
                            <TableCell className="py-1 text-xs text-green-500">{order.price.toFixed(4)}</TableCell>
                            <TableCell className="py-1 text-xs text-right">{order.amount.toFixed(4)}</TableCell>
                            <TableCell className="py-1 text-xs text-right">{order.total.toFixed(4)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

    