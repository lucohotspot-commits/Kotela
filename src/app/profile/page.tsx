
"use client";

import { useState, useEffect } from 'react';
import { getCurrency, addCurrency } from '@/lib/storage';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Coins, Eye, Copy, ShieldCheck, Settings, ArrowRight, User, Pickaxe, Trophy, Upload, Download, Send, Replace, QrCode, EyeOff, Moon, Gift, Users, Wallet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ThemeToggle } from '@/components/theme-toggle';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';


const KTC_TO_USD_RATE = 1.25;

const referrals = [
    { id: 1, user: 'CryptoKing', avatar: 'https://picsum.photos/seed/ref1/40/40', date: '2024-12-10', profit: 150.75 },
    { id: 2, user: 'SatoshiJr', avatar: 'https://picsum.photos/seed/ref2/40/40', date: '2024-11-25', profit: 75.50 },
    { id: 3, user: 'CoinDuchess', avatar: 'https://picsum.photos/seed/ref3/40/40', date: '2024-11-18', profit: 225.00 },
    { id: 4, user: 'MinerMike', avatar: 'https://picsum.photos/seed/ref4/40/40', date: '2024-10-30', profit: 50.25 },
    { id: 5, user: 'HodlHermit', avatar: 'https://picsum.photos/seed/ref5/40/40', date: '2024-10-15', profit: 300.00 },
];

export default function ProfilePage() {
  const [currency, setCurrency] = useState(0);
  const [depositAmount, setDepositAmount] = useState('');
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isBalanceVisible, setIsBalanceVisible] = useState(false);
  const { toast } = useToast();

  const refreshCurrency = () => {
    setCurrency(getCurrency());
  }

  useEffect(() => {
    refreshCurrency();
  }, []);
  
  const walletAddress = "0x1a2b3c4d5e6f7g8h9i0jabcde12345fgh67890";
  const referralLink = "https://kotela.com/join/user123";

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${type} copied to clipboard.`,
    });
  };

  const handleDeposit = () => {
    const amount = parseFloat(depositAmount);
    if (!isNaN(amount) && amount > 0) {
      addCurrency(amount);
      refreshCurrency();
      setDepositAmount('');
      setIsDepositOpen(false);
      toast({
        title: "Deposit Successful!",
        description: `${amount.toLocaleString()} KTC has been added to your wallet.`,
      });
    } else {
       toast({
        variant: 'destructive',
        title: "Invalid Amount",
        description: "Please enter a valid number of coins to deposit.",
      });
    }
  }

  const toggleBalanceVisibility = () => {
    setIsBalanceVisible(!isBalanceVisible);
  };
  
  const currencyAsUSD = (currency * KTC_TO_USD_RATE).toFixed(2);
  const hiddenBalance = "********";
  
  const totalReferralProfit = referrals.reduce((acc, ref) => acc + ref.profit, 0);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
            <Wallet className="h-6 w-6" /> My Wallet
        </h1>
        <div className="grid grid-cols-2 sm:flex sm:items-center gap-2">
          <Dialog open={isDepositOpen} onOpenChange={setIsDepositOpen}>
            <DialogTrigger asChild>
              <Button>
                <Upload className="mr-2" />
                Deposit
              </Button>
            </DialogTrigger>
            <DialogContent className="h-full sm:h-auto sm:max-h-[90vh] flex flex-col">
              <DialogHeader>
                <DialogTitle>Deposit KTC</DialogTitle>
                <DialogDescription>
                  This is a simulation. Enter an amount to add coins to your balance.
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="flex-grow -mx-6 px-6">
                <div className="space-y-4 py-4">
                    <div className="flex flex-col items-center justify-center space-y-2">
                        <div className='p-4 bg-card rounded-lg'>
                            <QrCode className="h-32 w-32 bg-black text-white" />
                        </div>
                        <p className='text-xs text-muted-foreground text-center max-w-xs'>
                            Send only KTC to this deposit address. This address does not support NFT deposits.
                        </p>
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="wallet-address-deposit">Wallet Address</Label>
                      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <span id="wallet-address-deposit" className="font-mono text-sm text-muted-foreground truncate">{walletAddress}</span>
                        <Button variant="ghost" size="icon" onClick={() => handleCopy(walletAddress, 'Wallet address')}>
                            <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label>Network</Label>
                      <p className='font-semibold'>Kotela Network</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount</Label>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="Enter amount to deposit"
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                      />
                    </div>
                </div>
              </ScrollArea>
              <DialogFooter className="flex-col-reverse sm:flex-row mt-auto pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDepositOpen(false)}>Cancel</Button>
                <Button type="submit" onClick={handleDeposit}>Deposit</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button variant="outline">
            <Download className="mr-2" />
            Withdraw
          </Button>
          <Button variant="outline">
            <Send className="mr-2" />
            Send
          </Button>
          <Button variant="outline">
            <Replace className="mr-2" />
            Transfer
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
            <div className='flex items-center justify-between'>
                <CardDescription>Estimated Balance</CardDescription>
                <button onClick={toggleBalanceVisibility} className="text-muted-foreground hover:text-primary">
                  {isBalanceVisible ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                </button>
            </div>
            <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-3xl font-bold">
                  {isBalanceVisible ? `${currency.toFixed(8)} KTC` : hiddenBalance}
                </span>
                <span className="text-muted-foreground">
                  {isBalanceVisible ? `≈ $${currencyAsUSD}` : ''}
                </span>
            </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t pt-4">
            <div>
                <p className='text-sm text-muted-foreground'>Spot balance</p>
                <p className="font-semibold">{isBalanceVisible ? `${currency.toFixed(8)} KTC` : hiddenBalance}</p>
                <p className="text-sm text-muted-foreground">{isBalanceVisible ? `≈ $${currencyAsUSD}`: ''}</p>
            </div>
             <div>
                <p className='text-sm text-muted-foreground'>Fiat balance</p>
                <p className="font-semibold">{isBalanceVisible ? '0.00000000 KTC' : hiddenBalance}</p>
                <p className="text-sm text-muted-foreground">{isBalanceVisible ? '≈ $0.00' : ''}</p>
            </div>
        </CardContent>
      </Card>
      
      <Dialog>
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Wallet className="h-5 w-5" />
                    Wallet Address
                </CardTitle>
                <CardDescription>Use this address to receive KTC tokens.</CardDescription>
            </CardHeader>
            <CardContent>
                <DialogTrigger asChild>
                    <button className="flex items-center justify-between p-3 bg-muted rounded-lg w-full text-left">
                        <span className="font-mono text-sm text-muted-foreground truncate">{walletAddress}</span>
                        <div className="flex items-center gap-2">
                            <QrCode className="h-4 w-4" />
                            <Copy className="h-4 w-4" />
                        </div>
                    </button>
                </DialogTrigger>
            </CardContent>
        </Card>
        <DialogContent className="max-w-sm">
            <DialogHeader>
                <DialogTitle>Your Wallet Address</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center justify-center space-y-4 pt-4">
                <div className='p-4 bg-white rounded-lg'>
                    <QrCode className="h-48 w-48 text-black" />
                </div>
                <p className='text-sm text-muted-foreground break-all text-center'>{walletAddress}</p>
            </div>
            <DialogFooter className="grid grid-cols-2 gap-2 pt-4">
                <Button variant="outline" onClick={() => handleCopy(walletAddress, 'Wallet address')}>
                    <Copy className="mr-2" />
                    Copy
                </Button>
                <Button>
                    <Download className="mr-2" />
                    Save
                </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5" />
                Referrals
            </CardTitle>
            <CardDescription>Invite friends and earn rewards when they sign up and start mining.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="referral-link">Your Referral Link</Label>
                <div className="flex items-center gap-2">
                    <Input id="referral-link" value={referralLink} readOnly />
                    <Button variant="outline" size="icon" onClick={() => handleCopy(referralLink, 'Referral link')}>
                        <Copy className="h-4 w-4" />
                    </Button>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center border-t pt-4">
                <div>
                    <p className="text-sm text-muted-foreground flex items-center justify-center gap-1"><Users className="h-4 w-4" /> Friends Invited</p>
                    <p className="text-2xl font-bold">{referrals.length}</p>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground flex items-center justify-center gap-1"><Coins className="h-4 w-4" /> Total Earnings</p>
                    <p className="text-2xl font-bold flex items-center justify-center gap-1">{totalReferralProfit.toLocaleString()}</p>
                </div>
            </div>
        </CardContent>
        <CardFooter>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                        View Referral Details
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md w-full">
                    <DialogHeader>
                        <DialogTitle>Referral Details</DialogTitle>
                        <DialogDescription>
                            Here's a list of users you've referred and the profit you've earned.
                        </DialogDescription>
                    </DialogHeader>
                    <ScrollArea className='max-h-[60vh]'>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-xs">User</TableHead>
                                    <TableHead className="text-xs">Date Joined</TableHead>
                                    <TableHead className="text-right text-xs">Profit (KTC)</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {referrals.map((referral) => (
                                    <TableRow key={referral.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={referral.avatar} alt={referral.user} />
                                                    <AvatarFallback>{referral.user.substring(0,2)}</AvatarFallback>
                                                </Avatar>
                                                <span className="font-medium text-sm">{referral.user}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground text-xs">{referral.date}</TableCell>
                                        <TableCell className="text-right font-semibold text-green-500 text-sm">{referral.profit.toFixed(2)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        </CardFooter>
      </Card>
      
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Account</h3>
        <Card>
          <div className="divide-y">
            <Link href="/profile/verify" className="p-4 flex items-center justify-between hover:bg-muted/50">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">KYC Verification</span>
              </div>
               <div className="flex items-center gap-2 text-yellow-600">
                <span className="text-sm">Unverified</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
            <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Moon className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">Dark Mode</span>
                </div>
                <ThemeToggle />
            </div>
             <div className="p-4 flex items-center justify-between hover:bg-muted/50 cursor-pointer">
              <div className="flex items-center gap-3">
                <Settings className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">Settings</span>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </Card>
      </div>

    </div>
  );
}
