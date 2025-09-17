
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const earnProducts = [
  {
    coin: 'USDT',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="16" fill="#26A17B"/>
        <path d="M16 24C20.4183 24 24 20.4183 24 16C24 11.5817 20.4183 8 16 8C11.5817 8 8 11.5817 8 16C8 20.4183 11.5817 24 16 24Z" fill="white"/>
        <path d="M18.5 14.5H13.5V12.5H21V14.5H18.5V21H16.5V14.5H13.5V12.5H11V14.5H13.5V21H11V22H21V21H18.5V14.5Z" fill="#26A17B"/>
      </svg>
    ),
    apr: '5.42%',
    isHot: true,
    duration: ['Flexible', '14', '30', '60', '90'],
    action: 'Subscribe',
    actionVariant: 'default' as const
  },
  {
    coin: 'BTC',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="16" fill="#F7931A"/>
        <path d="M20.5714 13.7143C21.0381 14.0571 21.5048 14.4 21.5048 15.0857C21.5048 15.9048 20.8 16.5 19.8286 16.7333V16.7667C20.9333 16.9333 21.8476 17.619 21.8476 18.7333C21.8476 19.6476 21.2476 20.3 20.381 20.6476V21.5H17.8V20.619C17.3 20.719 16.7667 20.819 16.2 20.8857V22H14.1V20.8857C13.6333 20.819 13.2 20.7524 12.8 20.6476V21.5H10.2V20.6476C9.4 20.2667 8.90001 19.581 8.90001 18.7C8.90001 17.5857 9.80001 16.8667 10.9333 16.7V16.6667C10.0286 16.4333 9.23334 15.8333 9.23334 14.8571C9.23334 13.9429 9.83334 13.2286 10.7333 12.8857V12H13.2V12.9143C13.6667 12.8143 14.1667 12.7476 14.7 12.681V11H16.8V12.681C17.3333 12.7476 17.8333 12.8476 18.3 12.9429V12H20.9333V12.8857C21.8 13.1857 22.3 13.9 22.3 14.9C22.3 15.7 21.8 16.3 21 16.7L20.5714 13.7143ZM17.1333 18.8C17.1333 17.8667 16.2 17.6 15.1667 17.6V19.9333C16.2 19.9333 17.1333 19.7333 17.1333 18.8ZM16.8 15.8667C16.8 15.0667 16.0333 14.8 15.1667 14.8V16.8C16.0333 16.8 16.8 16.6667 16.8 15.8667Z" fill="white"/>
      </svg>
    ),
    apr: '0.88%',
    isHot: false,
    duration: ['Flexible'],
    action: 'Subscribe',
    actionVariant: 'default' as const
  },
    {
    coin: 'KTC',
    icon: (
       <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-flame"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>
       </div>
    ),
    apr: '10.00%',
    isHot: true,
    duration: ['30', '60', '90', '120'],
    action: 'Stake',
    actionVariant: 'secondary' as const
  },
];

export default function LeaderboardPage() {
  const [selectedDurations, setSelectedDurations] = useState<{[key: string]: string}>({});

  const handleDurationSelect = (coin: string, duration: string) => {
    setSelectedDurations(prev => ({...prev, [coin]: duration}));
  }

  return (
    <div className="flex-grow flex flex-col items-center">
      <Card className="w-full max-w-6xl">
        <CardHeader>
          <CardTitle className="text-2xl">
            Simple Earn
          </CardTitle>
          <CardDescription>One-stop investment solution with a clear view of your earnings.</CardDescription>
            <div className="relative mt-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search Coin" className="pl-10" />
            </div>
        </CardHeader>
        <CardContent>
            <div className='overflow-x-auto'>
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Coin</TableHead>
                        <TableHead>Est. APR</TableHead>
                        <TableHead>Duration (Days)</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {earnProducts.map((product) => (
                        <TableRow key={product.coin}>
                        <TableCell>
                            <div className="flex items-center gap-3">
                                {product.icon}
                                <div className='font-bold'>{product.coin}</div>
                            </div>
                        </TableCell>
                        <TableCell>
                            <div className='flex items-center gap-2'>
                                <span className='text-green-500 font-semibold text-base'>{product.apr}</span>
                                {product.isHot && <Badge variant="destructive">HOT</Badge>}
                            </div>
                        </TableCell>
                        <TableCell>
                            <div className="flex items-center gap-1 flex-wrap">
                                {product.duration.map(d => (
                                <Button 
                                    key={d} 
                                    size="sm" 
                                    variant={selectedDurations[product.coin] === d ? "secondary" : "outline"}
                                    onClick={() => handleDurationSelect(product.coin, d)}
                                    className="h-8 text-xs"
                                >
                                    {d}
                                </Button>
                                ))}
                            </div>
                        </TableCell>
                        <TableCell className="text-right">
                            <Button className='bg-yellow-500 hover:bg-yellow-600 text-black'>
                                {product.action}
                            </Button>
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}

    