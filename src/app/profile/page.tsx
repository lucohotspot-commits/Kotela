
"use client";

import { useState, useEffect } from 'react';
import { getCurrency, addCurrency } from '@/lib/storage';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Coins, Eye, Copy, ShieldCheck, Settings, ArrowRight, User, Pickaxe, Trophy, Upload, Download, Send, Replace, QrCode, EyeOff, Moon } from 'lucide-react';
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

const KTC_TO_USD_RATE = 1.25;

export default function ProfilePage() {
  const [currency, setCurrency] = useState(0);
  const [depositAmount, setDepositAmount] = useState('');
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const { toast } = useToast();

  const refreshCurrency = () => {
    setCurrency(getCurrency());
  }

  useEffect(() => {
    refreshCurrency();
  }, []);
  
  const walletAddress = "0x1a2b3c4d5e6f7g8h9i0j...";

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    toast({
      title: "Copied!",
      description: "Wallet address copied to clipboard.",
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

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
            <User className="h-6 w-6" /> My Wallet
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
                            <QrCode className="h-32 w-32 bg-white text-black p-2 rounded-md" />
                        </div>
                        <p className='text-xs text-muted-foreground text-center max-w-xs'>
                            Send only KTC to this deposit address. This address does not support NFT deposits.
                        </p>
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="wallet-address">Wallet Address</Label>
                      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <span id="wallet-address" className="font-mono text-sm text-muted-foreground truncate">{walletAddress}</span>
                        <Button variant="ghost" size="icon" onClick={handleCopyAddress}>
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

      <Card>
        <CardHeader>
            <CardTitle>Wallet Address</CardTitle>
            <CardDescription>Use this address to receive KTC tokens.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="font-mono text-sm text-muted-foreground truncate">{walletAddress}</span>
                <Button variant="ghost" size="icon" onClick={handleCopyAddress}>
                    <Copy className="h-4 w-4" />
                </Button>
            </div>
        </CardContent>
      </Card>
      
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Account</h3>
        <Card>
          <div className="divide-y">
            <div className="p-4 flex items-center justify-between hover:bg-muted/50 cursor-pointer">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">Identity Verification</span>
              </div>
               <div className="flex items-center gap-2 text-yellow-600">
                <span className="text-sm">Unverified</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
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
