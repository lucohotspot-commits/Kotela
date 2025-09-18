
"use client";

import { useState, useEffect, useCallback } from 'react';
import { getWallets, addWallet, deleteWallet as removeWallet, type Wallet as WalletType } from '@/lib/storage';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Coins, Eye, Copy, ShieldCheck, Settings, ArrowRight, User, Upload, Download, Send, Repeat, PlusCircle, Globe, Trash2, EyeOff, Users, ArrowRightLeft } from 'lucide-react';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

const networks = [
    { id: 'eth', name: 'Ethereum' },
    { id: 'sol', name: 'Solana' },
    { id: 'btc', name: 'Bitcoin' },
    { id: 'bnb', name: 'BNB Smart Chain' },
];

export default function ProfilePage() {
  const [wallets, setWallets] = useState<WalletType[]>([]);
  const [isBalanceVisible, setIsBalanceVisible] = useState(false);
  const [isCreateWalletOpen, setIsCreateWalletOpen] = useState(false);
  const [isDeleteWalletOpen, setIsDeleteWalletOpen] = useState(false);
  const [walletToDelete, setWalletToDelete] = useState<WalletType | null>(null);
  const [selectedNetwork, setSelectedNetwork] = useState('');
  const { toast } = useToast();

  const refreshWallets = useCallback(() => {
    setWallets(getWallets());
  }, []);

  useEffect(() => {
    refreshWallets();
    const handleStorageChange = () => {
        refreshWallets();
    }
    window.addEventListener('storage', handleStorageChange);
    return () => {
        window.removeEventListener('storage', handleStorageChange);
    }
  }, [refreshWallets]);

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
      const networkName = networks.find(n => n.id === selectedNetwork)?.name || 'New';
      addWallet(networkName);
      refreshWallets();
      setIsCreateWalletOpen(false);
      setSelectedNetwork('');
      toast({
          title: 'Wallet Created',
          description: `A new ${networkName} wallet has been added to your account.`,
      });
  }

  const openDeleteDialog = (wallet: WalletType) => {
    setWalletToDelete(wallet);
    setIsDeleteWalletOpen(true);
  }

  const handleDeleteWallet = () => {
      if (walletToDelete) {
          removeWallet(walletToDelete.id);
          refreshWallets();
          toast({
              title: 'Wallet Deleted',
              description: `${walletToDelete.networkName} wallet has been removed.`,
          });
      }
      setIsDeleteWalletOpen(false);
      setWalletToDelete(null);
  }

  const toggleBalanceVisibility = () => {
    setIsBalanceVisible(!isBalanceVisible);
  };
  
  const totalBalance = wallets.reduce((acc, wallet) => acc + wallet.balance, 0);
  const hiddenBalance = "********";

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
                <CardTitle>My Wallets</CardTitle>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Total Balance:</span>
                    <span className="text-lg font-bold">
                        {isBalanceVisible ? `${totalBalance.toLocaleString()} KTC` : hiddenBalance}
                    </span>
                    <button onClick={toggleBalanceVisibility} className="text-muted-foreground hover:text-primary">
                      {isBalanceVisible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                </div>
            </div>
        </CardHeader>
        <CardContent className="p-0">
            <div className="divide-y">
                {wallets.map(wallet => (
                    <div key={wallet.id} className="p-4 grid grid-cols-3 items-center gap-4">
                        <div className="flex items-center gap-3">
                            <Globe className="h-6 w-6 text-muted-foreground" />
                            <div>
                                <p className="font-semibold">{wallet.networkName}</p>
                                <p className="text-xs text-muted-foreground font-mono">{`${wallet.address.substring(0, 6)}...${wallet.address.substring(wallet.address.length - 4)}`}</p>
                            </div>
                        </div>
                        <div className="text-center font-mono">
                            {isBalanceVisible ? `${wallet.balance.toLocaleString()} KTC` : hiddenBalance}
                        </div>
                        <div className="flex justify-end gap-2">
                            {wallet.networkName !== 'Kotela' ? (
                                <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(wallet)}>
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                            ) : (
                                <div className="w-9 h-9"></div> // Placeholder for alignment
                            )}
                            <Button variant="ghost" size="icon" onClick={() => handleCopy(wallet.address, `${wallet.networkName} address`)}>
                                <Copy className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </CardContent>
         <CardFooter className="p-4 border-t">
            <div className="w-full grid grid-cols-1 sm:grid-cols-3 items-center gap-4">
                <div className="col-span-2 grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-muted-foreground">Fiat and Spot</p>
                        <p className="font-semibold">{isBalanceVisible ? `${totalBalance.toLocaleString()} KTC` : hiddenBalance}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Trading Bots</p>
                        <p className="font-semibold">{isBalanceVisible ? `0.00 KTC` : hiddenBalance}</p>
                    </div>
                </div>
                <Button variant="outline" className="w-full sm:w-auto sm:justify-self-end">
                    <ArrowRightLeft className="mr-2 h-4 w-4" />
                    Transfer
                </Button>
            </div>
        </CardFooter>
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
                <Button variant="outline" className="h-auto flex-col gap-2 p-4" disabled={wallets.length >= 5}>
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
                                <SelectItem key={network.id} value={network.id} disabled={wallets.some(w => w.networkName === network.name)}>
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

       <Dialog open={isDeleteWalletOpen} onOpenChange={setIsDeleteWalletOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Wallet</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete the {walletToDelete?.networkName} wallet? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="ghost" onClick={() => setIsDeleteWalletOpen(false)}>Cancel</Button>
                    <Button variant="destructive" onClick={handleDeleteWallet}>Delete</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
      
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
                    <User className="h-5 w-5 text-muted-foreground" />
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

    