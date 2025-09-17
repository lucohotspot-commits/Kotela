
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { ChevronRight, Users, Coins, ThumbsUp, CheckCircle, RefreshCw, SlidersHorizontal, ChevronDown, Filter } from 'lucide-react';
import { getCurrency, spendCurrency } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const advertisers = [
  {
    name: 'NobleDigital',
    avatar: 'https://picsum.photos/seed/p2p1/40/40',
    isVerified: true,
    orders: 2388,
    completion: 100,
    rating: 97.9,
    price: 1.01,
    available: 15000.50,
    limitMin: 200,
    limitMax: 13919,
    payments: ['SEPA (EU) bank transfer', 'Bank Transfer', 'SEPA Instant'],
  },
  {
    name: 'Aura-Legal_2417',
    avatar: 'https://picsum.photos/seed/p2p2/40/40',
    isVerified: true,
    orders: 1923,
    completion: 99.7,
    rating: 85.08,
    price: 1.02,
    available: 12500.00,
    limitMin: 100,
    limitMax: 10000,
    payments: ['SEPA (EU) bank transfer', 'ZEN', 'SEPA Instant'],
  },
  {
    name: 'SEPA-Exchange',
    avatar: 'https://picsum.photos/seed/p2p3/40/40',
    isVerified: false,
    orders: 3960,
    completion: 97.41,
    rating: 97.41,
    price: 1.03,
    available: 25000.75,
    limitMin: 50,
    limitMax: 25000,
    payments: ['SEPA (EU) bank transfer', 'ZEN', 'Bank Transfer'],
  },
   {
    name: 'CryptoWhale',
    avatar: 'https://picsum.photos/seed/p2p4/40/40',
    isVerified: true,
    orders: 5012,
    completion: 99.9,
    rating: 99.5,
    price: 1.00,
    available: 100000.00,
    limitMin: 1000,
    limitMax: 50000,
    payments: ['Bank Transfer'],
  },
];

const cryptoCurrencies = ['USDT', 'BTC', 'FDUSD', 'BNB', 'ETH', 'DAI', 'SHIB', 'USDC'];

const AdvertiserCard = ({ advertiser }: { advertiser: typeof advertisers[0] }) => {
    return (
        <div className="border-b last:border-b-0">
            <div className="p-4 grid grid-cols-1 md:grid-cols-5 gap-4 items-start">
                {/* Advertiser Info */}
                <div className="md:col-span-1 space-y-2">
                    <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={advertiser.avatar} />
                            <AvatarFallback>{advertiser.name.substring(0,2)}</AvatarFallback>
                        </Avatar>
                        <div className="font-bold text-base flex items-center gap-1">
                            {advertiser.name}
                            {advertiser.isVerified && <CheckCircle className="h-4 w-4 text-yellow-500" />}
                        </div>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1 pl-10">
                        <p>{advertiser.orders} orders</p>
                        <p>{advertiser.completion.toFixed(2)}% completion</p>
                        <div className="flex items-center gap-1">
                            <ThumbsUp className="h-3 w-3" />
                            <span>{advertiser.rating.toFixed(2)}%</span>
                        </div>
                    </div>
                </div>

                {/* Price */}
                <div className="text-sm">
                    <p className="text-xs text-muted-foreground md:hidden">Price</p>
                    <p className="text-lg font-semibold">{advertiser.price.toFixed(3)} USDT</p>
                </div>
                
                {/* Available / Limit */}
                <div className="text-sm">
                    <p className="text-xs text-muted-foreground md:hidden">Available / Limit</p>
                    <p className="font-semibold">{advertiser.available.toLocaleString()} KTC</p>
                    <p className="text-muted-foreground">{advertiser.limitMin.toLocaleString()} ~ {advertiser.limitMax.toLocaleString()} USDT</p>
                </div>

                {/* Payment */}
                <div className='text-xs'>
                    <p className="text-xs text-muted-foreground md:hidden">Payment Methods</p>
                    {advertiser.payments.map(p => <p key={p}>{p}</p>)}
                </div>

                {/* Trade */}
                <div className="flex flex-col items-start md:items-end">
                    <Button className="w-full md:w-auto bg-green-600 hover:bg-green-700">Buy KTC</Button>
                </div>
            </div>
        </div>
    )
}

export default function P2PTransferPage() {
    const [balance, setBalance] = useState(0);
    const [selectedCrypto, setSelectedCrypto] = useState('BTC');
    const { toast } = useToast();

    const refreshBalance = () => {
        setBalance(getCurrency());
    }

    useEffect(() => {
        refreshBalance();
    }, []);


    return (
        <div className="w-full max-w-6xl mx-auto space-y-6">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/profile">Profile</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator>
                        <ChevronRight />
                    </BreadcrumbSeparator>
                    <BreadcrumbItem>
                        <BreadcrumbPage>P2P Trading</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                       <Tabs defaultValue="buy" className="w-auto">
                            <TabsList className="p-1 border bg-muted rounded-lg h-auto">
                                <TabsTrigger value="buy" className="px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm">Buy</TabsTrigger>
                                <TabsTrigger value="sell" className="px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm">Sell</TabsTrigger>
                            </TabsList>
                        </Tabs>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-start sm:justify-end gap-4 overflow-x-auto pb-2 -mb-2">
                               {cryptoCurrencies.map(crypto => (
                                    <Button 
                                        key={crypto}
                                        variant="ghost" 
                                        size="sm" 
                                        className={cn(
                                            "text-muted-foreground h-auto p-1 flex-shrink-0",
                                            selectedCrypto === crypto && "text-primary font-bold border-b-2 border-primary rounded-none"
                                        )}
                                        onClick={() => setSelectedCrypto(crypto)}
                                    >
                                        {crypto}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-4 mt-4">
                        <div className="relative w-full md:w-auto md:flex-1">
                            <Input id="amount" placeholder="Enter amount" className="pr-24"/>
                            <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center">
                                <span className='h-full w-[1px] bg-border mx-2'></span>
                                <Select defaultValue="EUR">
                                    <SelectTrigger className="h-auto bg-transparent border-0 text-sm font-bold w-20">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="USDT">USDT</SelectItem>
                                        <SelectItem value="EUR">EUR</SelectItem>
                                        <SelectItem value="USD">USD</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <Select defaultValue="all">
                            <SelectTrigger id="payment" className="w-full md:w-auto md:flex-1">
                                <SelectValue placeholder="All Payments" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Payments</SelectItem>
                                <SelectItem value="sepa">SEPA</SelectItem>
                                <SelectItem value="zen">ZEN</SelectItem>
                                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                                <SelectItem value="pesapal">Pesapal</SelectItem>
                                <SelectItem value="jpesa">Jpesa</SelectItem>
                                <SelectItem value="transid">TransID</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select defaultValue="all">
                            <SelectTrigger id="regions" className="w-full md:w-auto md:flex-1">
                                <SelectValue placeholder="All Regions" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Regions</SelectItem>
                                <SelectItem value="eu">Europe</SelectItem>
                                <SelectItem value="us">United States</SelectItem>
                                <SelectItem value="asia">Asia</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="outline" size="icon" className="hidden md:flex">
                            <Filter className="h-4 w-4" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="hidden md:grid md:grid-cols-5 gap-4 items-center text-xs font-semibold text-muted-foreground px-4 pb-2 border-b">
                        <div>Advertisers</div>
                        <div>Price</div>
                        <div>Available / Limit</div>
                        <div>Payment</div>
                        <div className="text-right">Trade</div>
                    </div>
                    <div>
                        {advertisers.map(ad => (
                            <AdvertiserCard key={ad.name} advertiser={ad} />
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
