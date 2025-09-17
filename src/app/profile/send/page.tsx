
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { ChevronRight, Send, Coins, QrCode, ClipboardPaste, BookUser, ArrowRight, Flame } from 'lucide-react';
import { getCurrency, spendCurrency } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

const KTC_TO_USD_RATE = 1.25;
const NETWORK_FEE_KTC = 0.15;

export default function SendPage() {
    const [balance, setBalance] = useState(0);
    const [address, setAddress] = useState('');
    const [amount, setAmount] = useState('');
    const { toast } = useToast();

    useEffect(() => {
        setBalance(getCurrency());
    }, []);

    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText();
            setAddress(text);
        } catch (err) {
            toast({
                variant: 'destructive',
                title: 'Failed to paste',
                description: 'Could not read from clipboard. Please check permissions.',
            });
        }
    };
    
    const handleMaxAmount = () => {
        const max = Math.max(0, balance - NETWORK_FEE_KTC);
        setAmount(max.toString());
    }

    const handleSend = () => {
        const sendAmount = parseFloat(amount);
        if (!address) {
            toast({ variant: 'destructive', title: 'Address required', description: 'Please enter a recipient wallet address.'});
            return;
        }
        if (isNaN(sendAmount) || sendAmount <= 0) {
            toast({ variant: 'destructive', title: 'Invalid amount', description: 'Please enter a valid amount to send.'});
            return;
        }
        if (sendAmount + NETWORK_FEE_KTC > balance) {
            toast({ variant: 'destructive', title: 'Insufficient funds', description: 'Your balance is not enough to cover the amount and network fee.'});
            return;
        }

        const success = spendCurrency(sendAmount + NETWORK_FEE_KTC);
        if (success) {
            setBalance(getCurrency());
            setAmount('');
            setAddress('');
            toast({
                title: 'Transaction Successful',
                description: `${sendAmount.toLocaleString()} KTC sent to ${address.substring(0, 6)}...${address.substring(address.length - 4)}`,
            });
        }
    };
    
    const amountAsUSD = (parseFloat(amount) || 0) * KTC_TO_USD_RATE;
    const feeAsUSD = NETWORK_FEE_KTC * KTC_TO_USD_RATE;
    const totalInKTC = (parseFloat(amount) || 0) + NETWORK_FEE_KTC;
    const totalInUSD = amountAsUSD + feeAsUSD;

    return (
        <div className="w-full max-w-2xl mx-auto space-y-6">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild><Link href="/profile">Profile</Link></BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator><ChevronRight /></BreadcrumbSeparator>
                    <BreadcrumbItem>
                        <BreadcrumbPage>Send</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            
            <Card>
                <CardHeader>
                    <CardTitle className='flex items-center gap-2'>
                        <Send />
                        Send Crypto
                    </CardTitle>
                    <CardDescription>Transfer coins to another Kotela wallet.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="address">Recipient Address</Label>
                        <div className="flex gap-2">
                            <Input id="address" placeholder="Enter wallet address" value={address} onChange={(e) => setAddress(e.target.value)} />
                            <Button variant="outline" size="icon" onClick={handlePaste}><ClipboardPaste /></Button>
                            <Button variant="outline" size="icon"><BookUser /></Button>
                            <Button variant="outline" size="icon"><QrCode /></Button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="coin">Coin</Label>
                        <Select defaultValue="ktc">
                            <SelectTrigger id="coin">
                                <SelectValue>
                                    <div className="flex items-center gap-2">
                                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                            <Flame className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className='font-bold'>KTC</p>
                                            <p className='text-xs text-muted-foreground'>Kotela</p>
                                        </div>
                                    </div>
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ktc">
                                    <div className="flex items-center gap-2">
                                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                            <Flame className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className='font-bold'>KTC</p>
                                            <p className='text-xs text-muted-foreground'>Kotela</p>
                                        </div>
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-baseline">
                            <Label htmlFor="amount">Amount</Label>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Coins className="h-3 w-3 text-yellow-500" />
                                Balance: {balance.toLocaleString()} KTC
                            </span>
                        </div>
                        <div className="relative">
                            <Input 
                                id="amount" 
                                type="number" 
                                placeholder="0.00" 
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="text-2xl h-14 pr-24"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                <span className='text-muted-foreground'>KTC</span>
                                <Button variant="ghost" size="sm" onClick={handleMaxAmount}>Max</Button>
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground text-right">≈ ${amountAsUSD.toFixed(2)}</p>
                    </div>

                    <Card className="bg-muted/50">
                        <CardContent className="p-4 space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Amount</span>
                                <span>{parseFloat(amount || '0').toLocaleString()} KTC</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Network Fee</span>
                                <span>{NETWORK_FEE_KTC} KTC</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between font-bold">
                                <span>Total</span>
                                <span>{totalInKTC.toLocaleString()} KTC</span>
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span></span>
                                <span>≈ ${totalInUSD.toFixed(2)}</span>
                            </div>
                        </CardContent>
                    </Card>

                </CardContent>
                <CardFooter>
                    <Button className="w-full" size="lg" onClick={handleSend}>
                        Send
                        <ArrowRight className="ml-2" />
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}

