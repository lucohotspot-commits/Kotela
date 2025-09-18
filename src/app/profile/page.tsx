
"use client";

import { useState, useEffect, useCallback } from 'react';
import { getWallets, addWallet, deleteWallet as removeWallet, type Wallet as WalletType } from '@/lib/storage';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Coins, Eye, Copy, ShieldCheck, Settings, ArrowRight, User, Upload, Download, Send, PlusCircle, Globe, Trash2, EyeOff, Users, ArrowRightLeft, ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
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
import { ScrollArea } from '@/components/ui/scroll-area';

const networks = [
    { id: 'eth', name: 'Ethereum' },
    { id: 'sol', name: 'Solana' },
    { id: 'btc', name: 'Bitcoin' },
    { id: 'bnb', name: 'BNB Smart Chain' },
];

const referralData = [
  { user: 'CryptoKing', avatar: 'https://picsum.photos/seed/ref1/40/40', dateJoined: '2024-12-10', profit: 150.75 },
  { user: 'SatoshiJr', avatar: 'https://picsum.photos/seed/ref2/40/40', dateJoined: '2024-11-25', profit: 75.50 },
  { user: 'CoinDuchess', avatar: 'https://picsum.photos/seed/ref3/40/40', dateJoined: '2024-11-18', profit: 225.00 },
  { user: 'MinerMike', avatar: 'https://picsum.photos/seed/ref4/40/40', dateJoined: '2024-10-30', profit: 50.25 },
  { user: 'HodlHermit', avatar: 'https://picsum.photos/seed/ref5/40/40', dateJoined: '2024-10-15', profit: 300.00 },
  { user: 'DigitalNomad', avatar: 'https://picsum.photos/seed/ref6/40/40', dateJoined: '2024-10-01', profit: 120.00 },
  { user: 'ChainSurfer', avatar: 'https://picsum.photos/seed/ref7/40/40', dateJoined: '2024-09-22', profit: 88.88 },
  { user: 'AltcoinAlice', avatar: 'https://picsum.photos/seed/ref8/40/40', dateJoined: '2024-09-15', profit: 450.50 },
];

const referralLink = "https://kotela.com/join/user123";

const ReferralDialogContent = () => {
    const { toast } = useToast();
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 5;

    const handleCopy = (text: string, type: string) => {
        navigator.clipboard.writeText(text);
        toast({
          title: "Copied!",
          description: `${type} copied to clipboard.`,
        });
    };

    const paginatedReferrals = referralData.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);
    const totalPages = Math.ceil(referralData.length / itemsPerPage);

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Referral Details</DialogTitle>
                <DialogDescription>
                    Invite friends and earn rewards when they sign up and start mining.
                </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
                <div className="space-y-2">
                    <Label htmlFor="referralLink">Your Referral Link</Label>
                    <div className="flex gap-2">
                        <Input id="referralLink" value={referralLink} readOnly />
                        <Button variant="outline" size="icon" onClick={() => handleCopy(referralLink, "Referral Link")}>
                            <Copy className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
                <Separator />
                <div className="grid grid-cols-[1fr_auto_auto] items-center gap-4 px-2 text-sm font-semibold text-muted-foreground">
                    <span>User</span>
                    <span>Date Joined</span>
                    <span className="text-right">Profit (KTC)</span>
                </div>
                <ScrollArea className="h-60 pr-4">
                    <div className="space-y-4">
                    {paginatedReferrals.map((ref, index) => (
                        <div key={index} className="grid grid-cols-[1fr_auto_auto] items-center gap-4 px-2">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={ref.avatar} alt={ref.user} />
                                    <AvatarFallback>{ref.user.substring(0, 2)}</AvatarFallback>
                                </Avatar>
                                <span className="font-medium text-sm">{ref.user}</span>
                            </div>
                            <span className="text-sm text-muted-foreground">{ref.dateJoined}</span>
                            <span className="text-sm font-semibold text-green-500 text-right">{ref.profit.toFixed(2)}</span>
                        </div>
                    ))}
                    </div>
                </ScrollArea>
            </div>
            {totalPages > 1 && (
                <DialogFooter className='pt-4 sm:justify-between border-t'>
                     <span className="text-sm text-muted-foreground">
                        Page {currentPage + 1} of {totalPages}
                    </span>
                    <div className='flex gap-2'>
                        <Button
                            variant="outline"
                            onClick={() => setCurrentPage(p => p - 1)}
                            disabled={currentPage === 0}
                        >
                            <ChevronLeft className="mr-2 h-4 w-4" />
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => setCurrentPage(p => p + 1)}
                            disabled={currentPage >= totalPages - 1}
                        >
                            Next
                            <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </DialogFooter>
            )}
        </DialogContent>
    )
}


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
      if (wallets.length >= 3) {
          toast({ variant: 'destructive', title: 'Wallet limit reached', description: 'You can only have a maximum of 3 wallets.' });
          setIsCreateWalletOpen(false);
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
                <Button variant="outline" className="h-auto flex-col gap-2 p-4" disabled={wallets.length >= 3}>
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
                        <div>
                            <p className="font-medium">KYC Verification</p>
                            <p className="text-xs text-muted-foreground">Required for full feature access.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-yellow-600">
                        <span className="text-sm">Unverified</span>
                        <ArrowRight className="h-4 w-4" />
                    </div>
                </Link>
                <Dialog>
                    <DialogTrigger asChild>
                        <div className="p-4 flex items-center justify-between hover:bg-muted/50 cursor-pointer">
                            <div className="flex items-center gap-3">
                                <Users className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="font-medium">Referral</p>
                                    <p className="text-xs text-muted-foreground">Invite friends and earn rewards.</p>
                                </div>
                            </div>
                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                    </DialogTrigger>
                    <ReferralDialogContent />
                </Dialog>
                <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <User className="h-5 w-5 text-muted-foreground" />
                         <div>
                            <p className="font-medium">Dark Mode</p>
                            <p className="text-xs text-muted-foreground">Toggle between light and dark themes.</p>
                        </div>
                    </div>
                    <ThemeToggle />
                </div>
                <div className="p-4 flex items-center justify-between hover:bg-muted/50 cursor-pointer">
                    <div className="flex items-center gap-3">
                        <Settings className="h-5 w-5 text-muted-foreground" />
                         <div>
                            <p className="font-medium">Settings</p>
                            <p className="text-xs text-muted-foreground">Manage your account settings.</p>
                        </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
                <Link href="/auth/login" className="p-4 flex items-center justify-between hover:bg-muted/50">
                    <div className="flex items-center gap-3">
                        <LogOut className="h-5 w-5 text-destructive" />
                        <div>
                            <p className="font-medium text-destructive">Logout</p>
                            <p className="text-xs text-muted-foreground">Sign out of your account.</p>
                        </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Link>
            </div>
        </Card>
      </div>
    </div>
  );
}

    