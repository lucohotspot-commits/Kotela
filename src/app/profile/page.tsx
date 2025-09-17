
"use client";

import { useState, useEffect } from 'react';
import { getCurrency } from '@/lib/storage';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Coins, Eye, Copy, ShieldCheck, Settings, ArrowRight, User, Pickaxe, Trophy, Upload, Download, Send, Replace } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

export default function ProfilePage() {
  const [currency, setCurrency] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    setCurrency(getCurrency());
  }, []);
  
  const walletAddress = "0x1a2b3c4d5e6f7g8h9i0j...";

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    toast({
      title: "Copied!",
      description: "Wallet address copied to clipboard.",
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-primary">My Wallet</h1>
        <div className="flex items-center gap-2">
          <Button>
            <Upload className="mr-2" />
            Deposit
          </Button>
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
          <CardDescription>Estimated Balance</CardDescription>
          <div className="flex items-end justify-between">
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold">{currency.toLocaleString()} KTC</span>
              </div>
              <Eye className="h-5 w-5 text-muted-foreground cursor-pointer hover:text-primary" />
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle>Wallet Address</CardTitle>
            <CardDescription>Use this address to receive KTC tokens.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="font-mono text-sm text-muted-foreground">{walletAddress}</span>
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

