
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { ChevronRight, Download, Coins, Banknote, Wallet, ArrowRight, Hourglass, Smartphone, CheckCircle, Clock, XCircle } from 'lucide-react';
import { getCurrency, spendCurrency, getWithdrawals, addWithdrawal, type Withdrawal } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';


const KTC_TO_USD_RATE = 1.25;
const USD_TO_UGX_RATE = 3800;
const KTC_TO_UGX_RATE = KTC_TO_USD_RATE * USD_TO_UGX_RATE;
const WITHDRAWAL_FEE_KTC = 5.0;
const WITHDRAWAL_TIMESTAMPS_KEY = 'kotela-withdrawal-timestamps';
const WITHDRAWAL_LIMIT = 2;
const WITHDRAWAL_WINDOW_MS = 60 * 1000; // 1 minute

const paymentOptions = [
    { id: 'bank-1', type: 'Bank Transfer', details: 'Add your bank account', icon: Banknote, category: 'bank' },
    { id: 'wallet-1', type: 'Crypto Wallet', details: 'Add your wallet address', icon: Wallet, category: 'crypto' },
    { id: 'airtel-1', type: 'Airtel Money', details: 'Mobile Money', icon: Smartphone, category: 'mobile-money' },
    { id: 'mtn-1', type: 'MTN Mobile Money', details: 'Mobile Money', icon: Smartphone, category: 'mobile-money' },
];

export default function WithdrawPage() {
    const [balance, setBalance] = useState(0);
    const [amount, setAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
    
    // State for payment method details
    const [mobileNumber, setMobileNumber] = useState('');
    const [accountName, setAccountName] = useState('');
    const [bankName, setBankName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [walletAddress, setWalletAddress] = useState('');

    const [isRateLimited, setIsRateLimited] = useState(false);
    const [cooldown, setCooldown] = useState(0);
    const { toast } = useToast();
    
    const selectedPaymentOption = paymentOptions.find(p => p.id === paymentMethod);

    const refreshAllData = () => {
        setBalance(getCurrency());
        setWithdrawals(getWithdrawals());
    }

    useEffect(() => {
        refreshAllData();
        checkRateLimit();
    }, []);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (cooldown > 0) {
            timer = setInterval(() => {
                setCooldown(prev => prev - 1);
            }, 1000);
        } else if (isRateLimited) {
            setIsRateLimited(false);
        }
        return () => clearInterval(timer);
    }, [cooldown, isRateLimited]);

    const checkRateLimit = () => {
        const timestamps: number[] = JSON.parse(localStorage.getItem(WITHDRAWAL_TIMESTAMPS_KEY) || '[]');
        const now = Date.now();
        const recentTimestamps = timestamps.filter(ts => now - ts < WITHDRAWAL_WINDOW_MS);
        
        if (recentTimestamps.length >= WITHDRAWAL_LIMIT) {
            setIsRateLimited(true);
            const lastAttempt = recentTimestamps[recentTimestamps.length - 1];
            const timePassed = now - lastAttempt;
            const timeLeft = Math.ceil((WITHDRAWAL_WINDOW_MS - timePassed) / 1000);
            setCooldown(timeLeft > 0 ? timeLeft : 60);
            return true;
        }
        localStorage.setItem(WITHDRAWAL_TIMESTAMPS_KEY, JSON.stringify(recentTimestamps));
        return false;
    };
    
    const handleMaxAmount = () => {
        const max = Math.max(0, balance - WITHDRAWAL_FEE_KTC);
        setAmount(max.toString());
    }

    const handleWithdraw = () => {
        if (checkRateLimit()) {
             toast({ variant: 'destructive', title: 'Rate limit exceeded', description: 'You have made too many withdrawal attempts. Please try again later.' });
            return;
        }

        const withdrawAmount = parseFloat(amount);
        if (!paymentMethod || !selectedPaymentOption) {
            toast({ variant: 'destructive', title: 'Payment method required', description: 'Please select a payment method.'});
            return;
        }

        let paymentDetails = {};
        // Validation based on category
        if (selectedPaymentOption?.category === 'mobile-money') {
            if (!mobileNumber || !accountName) {
                toast({ variant: 'destructive', title: 'Mobile money details required', description: 'Please enter the phone number and account name.'});
                return;
            }
            paymentDetails = { type: selectedPaymentOption.type, mobileNumber, accountName };
        }
        if (selectedPaymentOption?.category === 'bank') {
            if (!bankName || !accountNumber || !accountName) {
                toast({ variant: 'destructive', title: 'Bank details required', description: 'Please fill in all bank account details.'});
                return;
            }
            paymentDetails = { type: selectedPaymentOption.type, bankName, accountNumber, accountName };
        }
        if (selectedPaymentOption?.category === 'crypto') {
            if (!walletAddress) {
                toast({ variant: 'destructive', title: 'Wallet address required', description: 'Please enter a valid wallet address.'});
                return;
            }
            paymentDetails = { type: selectedPaymentOption.type, walletAddress };
        }


        if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
            toast({ variant: 'destructive', title: 'Invalid amount', description: 'Please enter a valid amount to withdraw.'});
            return;
        }
        if (withdrawAmount + WITHDRAWAL_FEE_KTC > balance) {
            toast({ variant: 'destructive', title: 'Insufficient funds', description: 'Your balance is not enough to cover the amount and network fee.'});
            return;
        }

        const success = spendCurrency(withdrawAmount + WITHDRAWAL_FEE_KTC);
        if (success) {
            const newWithdrawal: Omit<Withdrawal, 'id'> = {
                amount: withdrawAmount,
                date: new Date().toISOString(),
                status: 'pending',
                paymentMethod: paymentDetails
            };
            addWithdrawal(newWithdrawal);
            refreshAllData();
            setAmount('');
            
            const timestamps: number[] = JSON.parse(localStorage.getItem(WITHDRAWAL_TIMESTAMPS_KEY) || '[]');
            timestamps.push(Date.now());
            localStorage.setItem(WITHDRAWAL_TIMESTAMPS_KEY, JSON.stringify(timestamps));

            toast({
                title: 'Withdrawal Request Submitted',
                description: `Your request to withdraw ${withdrawAmount.toLocaleString()} KTC is pending approval.`,
            });
        }
    };
    
    const amountAsUSD = (parseFloat(amount) || 0) * KTC_TO_USD_RATE;
    const totalToReceiveKTC = (parseFloat(amount) || 0);
    const totalToReceiveUGX = totalToReceiveKTC * KTC_TO_UGX_RATE;

    const StatusBadge = ({ status }: { status: 'pending' | 'approved' | 'rejected' }) => {
        const variants = {
            pending: {
                icon: <Hourglass className="h-3 w-3" />,
                text: 'Pending',
                className: 'bg-yellow-500/10 text-yellow-600',
            },
            approved: {
                icon: <CheckCircle className="h-3 w-3" />,
                text: 'Approved',
                className: 'bg-green-500/10 text-green-600',
            },
            rejected: {
                icon: <XCircle className="h-3 w-3" />,
                text: 'Rejected',
                className: 'bg-red-500/10 text-red-600',
            },
        };
        const { icon, text, className } = variants[status];
        return <Badge variant="outline" className={cn('gap-1', className)}>{icon}{text}</Badge>;
    };

    return (
        <div className="w-full max-w-2xl mx-auto space-y-6">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild><Link href="/profile">Profile</Link></BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator>
                        <ChevronRight />
                    </BreadcrumbSeparator>
                    <BreadcrumbItem>
                        <BreadcrumbPage>Withdraw</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            
            <Card>
                <CardHeader>
                    <CardTitle className='flex items-center gap-2'>
                        <Download />
                        Withdraw KTC
                    </CardTitle>
                    <CardDescription>Transfer coins from your Kotela wallet to an external account.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {isRateLimited && (
                        <Alert variant="destructive">
                            <Hourglass className="h-4 w-4" />
                            <AlertTitle>Too many requests</AlertTitle>
                            <AlertDescription>
                                You can attempt another withdrawal in {cooldown} seconds.
                            </AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="paymentMethod">To</Label>
                        <Select onValueChange={setPaymentMethod} value={paymentMethod} disabled={isRateLimited}>
                            <SelectTrigger id="paymentMethod">
                                <SelectValue placeholder="Select a payment method" />
                            </SelectTrigger>
                            <SelectContent>
                                {paymentOptions.map(method => {
                                    const Icon = method.icon;
                                    return (
                                        <SelectItem key={method.id} value={method.id}>
                                            <div className="flex items-center gap-3">
                                                <Icon className="h-5 w-5 text-muted-foreground" />
                                                <div>
                                                    <p>{method.type}</p>
                                                    <p className="text-xs text-muted-foreground">{method.details}</p>
                                                </div>
                                            </div>
                                        </SelectItem>
                                    )
                                })}
                            </SelectContent>
                        </Select>
                    </div>

                    {selectedPaymentOption?.category === 'mobile-money' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in-50">
                            <div className="space-y-2">
                                <Label htmlFor="mobileNumber">Phone Number</Label>
                                <Input 
                                    id="mobileNumber" 
                                    placeholder="e.g. 0771234567" 
                                    value={mobileNumber}
                                    onChange={(e) => setMobileNumber(e.target.value)}
                                    disabled={isRateLimited}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="accountName">Account Name</Label>
                                <Input 
                                    id="accountName" 
                                    placeholder="e.g. John Doe"
                                    value={accountName}
                                    onChange={(e) => setAccountName(e.target.value)}
                                    disabled={isRateLimited}
                                />
                            </div>
                        </div>
                    )}

                    {selectedPaymentOption?.category === 'bank' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in-50">
                            <div className="space-y-2">
                                <Label htmlFor="bankName">Bank Name</Label>
                                <Input id="bankName" placeholder="e.g. Stanbic Bank" value={bankName} onChange={(e) => setBankName(e.target.value)} disabled={isRateLimited} />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="accountName-bank">Account Name</Label>
                                <Input id="accountName-bank" placeholder="e.g. John Doe" value={accountName} onChange={(e) => setAccountName(e.target.value)} disabled={isRateLimited} />
                            </div>
                            <div className="space-y-2 col-span-1 sm:col-span-2">
                                <Label htmlFor="accountNumber">Account Number</Label>
                                <Input id="accountNumber" placeholder="e.g. 9030001234567" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} disabled={isRateLimited} />
                            </div>
                        </div>
                    )}

                    {selectedPaymentOption?.category === 'crypto' && (
                        <div className="space-y-2 animate-in fade-in-50">
                            <Label htmlFor="walletAddress">Wallet Address</Label>
                            <Input id="walletAddress" placeholder="Enter wallet address" value={walletAddress} onChange={(e) => setWalletAddress(e.target.value)} disabled={isRateLimited} />
                        </div>
                    )}
                    

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
                                disabled={isRateLimited}
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                <span className='text-muted-foreground'>KTC</span>
                                <Button variant="ghost" size="sm" onClick={handleMaxAmount} disabled={isRateLimited}>Max</Button>
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground text-right">≈ ${amountAsUSD.toFixed(2)}</p>
                    </div>

                    <Card className="bg-muted/50">
                        <CardContent className="p-4 space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Withdrawal Fee</span>
                                <span>{WITHDRAWAL_FEE_KTC} KTC</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between font-bold">
                                <span>You will receive</span>
                                <span>{totalToReceiveKTC.toLocaleString()} KTC</span>
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span></span>
                                <span>≈ {totalToReceiveUGX.toLocaleString('en-US', { style: 'currency', currency: 'UGX', minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                            </div>
                        </CardContent>
                    </Card>

                </CardContent>
                <CardFooter>
                    <Button className="w-full" size="lg" onClick={handleWithdraw} disabled={isRateLimited}>
                        Submit Withdraw
                        <ArrowRight className="ml-2" />
                    </Button>
                </CardFooter>
            </Card>

            {withdrawals.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Withdrawals</CardTitle>
                        <CardDescription>Your recent withdrawal requests and their status.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Method</TableHead>
                                    <TableHead className="text-right">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {withdrawals.map((w) => (
                                    <TableRow key={w.id}>
                                        <TableCell className="text-xs text-muted-foreground">
                                            {new Date(w.date).toLocaleString()}
                                        </TableCell>
                                        <TableCell className="font-semibold">
                                            {w.amount.toLocaleString()} KTC
                                        </TableCell>
                                        <TableCell className="text-xs">
                                            {w.paymentMethod.type}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <StatusBadge status={w.status} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
