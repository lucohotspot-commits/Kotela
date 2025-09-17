
"use client";

import { useState, useEffect, useMemo } from 'react';
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
const allPaymentMethods = ['All Payments', 'SEPA (EU) bank transfer', 'Bank Transfer', 'SEPA Instant', 'ZEN', 'Pesapal', 'Jpesa', 'TransID'];
const fiatCurrencies = ['USDT', 'EUR', 'USD', 'UGX', 'KES', 'NGN'];

const AdvertiserCard = ({ advertiser, tradeMode, fiatCurrency }: { advertiser: typeof advertisers[0], tradeMode: 'buy' | 'sell', fiatCurrency: string }) => {
    
    const getPaymentColor = (payment: string) => {
        if (payment.toLowerCase().includes('bank transfer')) {
            return 'bg-yellow-500';
        }
        if (payment.toLowerCase().includes('sepa')) {
            return 'bg-blue-500';
        }
        return 'bg-gray-400';
    }

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
                    <div className="text-xs text-muted-foreground space-y-1.5 pl-10">
                        <div className="flex items-center gap-2">
                            <span>{advertiser.orders} orders</span>
                            <span className="w-px h-3 bg-border" />
                            <span>{advertiser.completion.toFixed(2)}% completion</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <ThumbsUp className="h-3 w-3" />
                            <span>{advertiser.rating.toFixed(2)}%</span>
                        </div>
                    </div>
                </div>

                {/* Price */}
                <div className="text-sm">
                    <p className="text-xs text-muted-foreground md:hidden">Price</p>
                    <p className="flex items-baseline gap-1">
                        <span className="text-lg font-semibold">{advertiser.price.toFixed(3)}</span>
                        <span className="text-base text-muted-foreground font-serif">{fiatCurrency}</span>
                    </p>
                </div>
                
                {/* Available / Limit */}
                <div className="text-sm">
                    <p className="text-xs text-muted-foreground md:hidden">Available / Limit</p>
                    <p className="font-semibold">{advertiser.available.toLocaleString()} KTC</p>
                    <p className="text-muted-foreground">{advertiser.limitMin.toLocaleString()} ~ {advertiser.limitMax.toLocaleString()} {fiatCurrency}</p>
                </div>

                {/* Payment */}
                <div className='md:col-span-1 text-xs space-y-1'>
                    <p className="text-xs text-muted-foreground md:hidden">Payment Methods</p>
                    {advertiser.payments.map(p => (
                        <div key={p} className="flex items-center gap-1.5">
                            <span className={cn("h-3 w-[2px] rounded-full", getPaymentColor(p))}></span>
                            <p>{p}</p>
                        </div>
                    ))}
                </div>


                {/* Trade */}
                <div className="flex flex-col items-start md:items-end">
                    <Button 
                        className={cn("w-full md:w-auto", tradeMode === 'buy' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700')}
                    >
                       {tradeMode === 'buy' ? 'Buy KTC' : 'Sell KTC'}
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default function P2PTransferPage() {
    const [selectedCrypto, setSelectedCrypto] = useState('USDT');
    const [amount, setAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('All Payments');
    const [region, setRegion] = useState('All Regions');
    const [tradeMode, setTradeMode] = useState<'buy' | 'sell'>('buy');
    const [fiatCurrency, setFiatCurrency] = useState('USDT');
    const { toast } = useToast();

    const filteredAdvertisers = useMemo(() => {
        let result = advertisers;
        
        const numericAmount = parseFloat(amount);
        if (!isNaN(numericAmount) && numericAmount > 0) {
            result = result.filter(ad => numericAmount >= ad.limitMin && numericAmount <= ad.limitMax);
        }

        if (paymentMethod !== 'All Payments') {
            result = result.filter(ad => ad.payments.includes(paymentMethod));
        }
        
        // Region filter logic would go here if data was available

        return result;
    }, [amount, paymentMethod]);


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
                       <Tabs defaultValue="buy" onValueChange={(value) => setTradeMode(value as 'buy' | 'sell')} className="w-auto">
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
                            <Input 
                                id="amount" 
                                placeholder="Enter amount" 
                                className="pr-24"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                            <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center">
                                <span className='h-full w-[1px] bg-border mx-2'></span>
                                <Select value={fiatCurrency} onValueChange={setFiatCurrency}>
                                    <SelectTrigger className="h-auto bg-transparent border-0 text-sm font-bold w-20">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {fiatCurrencies.map(currency => (
                                            <SelectItem key={currency} value={currency}>{currency}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                            <SelectTrigger id="payment" className="w-full md:w-auto md:flex-1">
                                <SelectValue placeholder="All Payments" />
                            </SelectTrigger>
                            <SelectContent>
                                {allPaymentMethods.map(method => (
                                    <SelectItem key={method} value={method}>{method}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={region} onValueChange={setRegion}>
                            <SelectTrigger id="regions" className="w-full md:w-auto md:flex-1">
                                <SelectValue placeholder="All Regions" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All Regions">All Regions</SelectItem>
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
                        {filteredAdvertisers.length > 0 ? (
                            filteredAdvertisers.map(ad => (
                                <AdvertiserCard key={ad.name} advertiser={ad} tradeMode={tradeMode} fiatCurrency={fiatCurrency} />
                            ))
                        ) : (
                            <div className="text-center text-muted-foreground p-10">
                                <p>No advertisers match the current filters.</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

    