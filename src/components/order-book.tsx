
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
    const { sellOrders, buyOrders, maxTotal } = useMemo(() => {
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
        const sellOrders = generateOrders(15, true).sort((a,b) => b.price - a.price);
        const buyOrders = generateOrders(15, false).sort((a,b) => b.price - a.price);
        
        const allTotals = [...sellOrders, ...buyOrders].map(o => o.total);
        const maxTotal = Math.max(...allTotals);

        return {
            sellOrders,
            buyOrders,
            maxTotal,
        };
    }, [selectedCoin.price]);

    const getChangeColor = (change: number) => {
        if (change > 0) return 'text-green-500';
        if (change < 0) return 'text-red-500';
        return 'text-muted-foreground';
    };

    const OrderRow = ({ order, type, maxTotal }: { order: { price: number; amount: number; total: number }, type: 'buy' | 'sell', maxTotal: number }) => {
        const bgWidth = (order.total / maxTotal) * 100;
        const bgColor = type === 'buy' ? 'bg-green-500/20' : 'bg-red-500/20';
        
        return (
            <TableRow className='h-7 relative'>
                <TableCell className={`py-0 px-2 text-xs z-10 ${type === 'buy' ? 'text-green-500' : 'text-red-500'}`}>{order.price.toFixed(4)}</TableCell>
                <TableCell className="py-0 px-2 text-xs text-right z-10">{order.amount.toFixed(4)}</TableCell>
                <TableCell className="py-0 px-2 text-xs text-right z-10">{order.total.toFixed(4)}</TableCell>
                <td className="absolute top-0 right-0 h-full z-0" style={{ width: `${bgWidth}%`, backgroundColor: type === 'buy' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)' }} />
            </TableRow>
        )
    }

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
                            <OrderRow key={`sell-${i}`} order={order} type="sell" maxTotal={maxTotal} />
                        ))}
                        <TableRow className='h-9'>
                            <TableCell colSpan={3} className={`py-1 px-2 text-base font-bold text-center ${getChangeColor(selectedCoin.change)}`}>
                                {selectedCoin.price.toFixed(4)}
                            </TableCell>
                        </TableRow>
                        {buyOrders.map((order, i) => (
                            <OrderRow key={`buy-${i}`} order={order} type="buy" maxTotal={maxTotal} />
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
