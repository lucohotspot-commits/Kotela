
"use client";

import { useState, useEffect } from 'react';
import { getCurrency, addCurrency } from '@/lib/storage';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Coins, Eye, Copy, ShieldCheck, Settings, ArrowRight, User, Pickaxe, Trophy, Upload, Download, Send, Repeat, QrCode, EyeOff, Moon, Gift, Users, Wallet, PlusCircle, Globe } from 'lucide-react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const KTC_TO_USD_RATE = 1.25;

const referrals = [
    { id: 1, user: 'CryptoKing', avatar: 'https://picsum.photos/seed/ref1/40/40', date: '2024-12-10', profit: 150.75 },
    { id: 2, user: 'SatoshiJr', avatar: 'https://picsum.photos/seed/ref2/40/40', date: '2024-11-25', profit: 75.50 },
    { id: 3, user: 'CoinDuchess', avatar: 'https://picsum.photos/seed/ref3/40/40', date: '2024-11-18', profit: 225.00 },
    { id: 4, user: 'MinerMike', avatar: 'https://picsum.photos/seed/ref4/40/40', date: '2024-10-30', profit: 50.25 },
    { id: 5, user: 'HodlHermit', avatar: 'https://picsum.photos/seed/ref5/40/40', date: '2024-10-15', profit: 300.00 },
];

const networks = [
    { id: 'eth', name: 'Ethereum' },
    { id: 'sol', name: 'Solana' },
    { id: 'btc', name: 'Bitcoin' },
    { id: 'bnb', name: 'BNB Smart Chain' },
];

export default function ProfilePage() {
  const [currency, setCurrency] = useState(0);
  const [isBalanceVisible, setIsBalanceVisible] = useState(false);
  const [isCreateWalletOpen, setIsCreateWalletOpen] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState('');
  const { toast } = useToast();

  const refreshCurrency = () => {
    setCurrency(getCurrency());
  }

  useEffect(() => {
    refreshCurrency();
    const handleStorageChange = () => {
        refreshCurrency();
    }
    window.addEventListener('storage', handleStorageChange);
    return () => {
        window.removeEventListener('storage', handleStorageChange);
    }
  }, []);
  
  const referralLink = "https://kotela.com/join/user123";

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${type} copied to clipboard.`,
    });
  };

  const handleCreateWallet = () => {
      if (!selectedNetwork) {
          toast({ variant: 'destructive', title: 'Network required', description: 'Please select a network for your new wallet.' });
          return;
      }
      const networkName = networks.find(n => n.id === selectedNetwork)?.name;
      setIsCreateWalletOpen(false);
      setSelectedNetwork('');
      toast({
          title: 'Wallet Creation Simulated',
          description: `A new ${networkName} wallet has been added to your account.`,
      });
  }


  const toggleBalanceVisibility = () => {
    setIsBalanceVisible(!isBalanceVisible);
  };
  
  const currencyAsUSD = (currency * KTC_TO_USD_RATE).toFixed(2);
  const hiddenBalance = "********";
  
  const totalReferralProfit = referrals.reduce((acc, ref) => acc + ref.profit, 0);
  const fiatAndSpotBalance = currency * 0.7;
  const tradingBotsBalance = currency * 0.3;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Avatar className="h-20 w-20">
            <AvatarImage src="https://api.dicebear.com/9.x/bottts/svg?seed=kotela-user-123" alt="User Avatar" />
            <AvatarFallback>KU</AvatarFallback>
        </Avatar>
        <div>
            <h1 className="text-2xl font-bold">User Profile</h1>
            <div className="flex items-center gap-2 mt-1">
                <ShieldCheck className="h-4 w-4 text-yellow-500" />
                <span className="text-sm text-yellow-500 font-semibold">KYC Unverified</span>
            </div>
        </div>
      </div>

      <Card>
        <CardHeader>
            <div className='flex items-center justify-between'>
                <CardDescription>Total Balance</CardDescription>
                <button onClick={toggleBalanceVisibility} className="text-muted-foreground hover:text-primary">
                  {isBalanceVisible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
            </div>
            <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-3xl font-bold">
                  {isBalanceVisible ? `${currency.toLocaleString()} KTC` : hiddenBalance}
                </span>
                <span className="text-muted-foreground">
                  {isBalanceVisible ? `≈ $${currencyAsUSD}` : ''}
                </span>
            </div>
        </CardHeader>
        <CardContent>
            <div className="border-t pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <div>
                        <p className="text-muted-foreground">Fiat and Spot</p>
                        <p className="font-semibold">{isBalanceVisible ? `${fiatAndSpotBalance.toLocaleString()} KTC` : hiddenBalance}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground">Trading Bots</p>
                        <p className="font-semibold">{isBalanceVisible ? `${tradingBotsBalance.toLocaleString()} KTC` : hiddenBalance}</p>
                    </div>
                    <div className="sm:text-right">
                        <Button variant="ghost" size="sm">
                            Transfer <Repeat className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 text-center">
          <Button variant="outline" asChild className="h-auto flex-col gap-2 p-4">
            <Link href="/profile/deposit">
              <Upload className="h-6 w-6" />
              <span>Deposit</span>
            </Link>
          </Button>
          <Button variant="outline" asChild className="h-auto flex-col gap-2 p-4">
            <Link href="/profile/withdraw">
              <Download className="h-6 w-6" />
              <span>Withdraw</span>
            </Link>
          </Button>
          <Button variant="outline" asChild className="h-auto flex-col gap-2 p-4">
            <Link href="/profile/send">
              <Send className="h-6 w-6" />
              <span>Send</span>
            </Link>
          </Button>
          <Button variant="outline" asChild className="h-auto flex-col gap-2 p-4">
            <Link href="/profile/p2p">
              <Users className="h-6 w-6" />
              <span>P2P</span>
            </Link>
          </Button>
          <Dialog open={isCreateWalletOpen} onOpenChange={setIsCreateWalletOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="h-auto flex-col gap-2 p-4">
                    <PlusCircle className="h-6 w-6" />
                    <span>Create Wallet</span>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create a New Wallet</DialogTitle>
                    <DialogDescription>Select a network to create a new wallet address for deposits and withdrawals.</DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                    <Label htmlFor="network">Network</Label>
                    <Select onValueChange={setSelectedNetwork} value={selectedNetwork}>
                        <SelectTrigger id="network">
                            <SelectValue placeholder="Select a network" />
                        </SelectTrigger>
                        <SelectContent>
                            {networks.map(network => (
                                <SelectItem key={network.id} value={network.id}>
                                    <div className="flex items-center gap-2">
                                        <Globe className="h-4 w-4" />
                                        <span>{network.name}</span>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCreateWalletOpen(false)}>Cancel</Button>
                    <Button onClick={handleCreateWallet}>Create Wallet</Button>
                </DialogFooter>
            </DialogContent>
          </Dialog>
      </div>

      
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

    