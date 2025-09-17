
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { ChevronRight, Users, Coins } from 'lucide-react';
import { getCurrency, spendCurrency } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

export default function P2PTransferPage() {
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');
    const [note, setNote] = useState('');
    const [balance, setBalance] = useState(0);
    const { toast } = useToast();

    const refreshBalance = () => {
        setBalance(getCurrency());
    }

    useEffect(() => {
        refreshBalance();
    }, []);

    const handleTransfer = () => {
        const transferAmount = parseFloat(amount);
        if (!recipient) {
            toast({ variant: 'destructive', title: "Recipient required", description: "Please enter a recipient's User ID or email." });
            return;
        }
        if (isNaN(transferAmount) || transferAmount <= 0) {
            toast({ variant: 'destructive', title: "Invalid amount", description: "Please enter a valid amount to transfer." });
            return;
        }
        if (balance < transferAmount) {
            toast({ variant: 'destructive', title: "Insufficient funds", description: "You don't have enough KTC to make this transfer." });
            return;
        }

        const success = spendCurrency(transferAmount);
        if (success) {
            refreshBalance();
            setRecipient('');
            setAmount('');
            setNote('');
            toast({
                title: "Transfer Successful!",
                description: `You sent ${transferAmount.toLocaleString()} KTC to ${recipient}.`,
            });
        } else {
             toast({ variant: 'destructive', title: "Transfer Failed", description: "An unexpected error occurred. Please try again." });
        }
    }

    return (
        <div className="w-full max-w-2xl mx-auto space-y-6">
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
                        <BreadcrumbPage>P2P Transfer</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            
            <div className="flex items-center gap-2">
                <Users className="h-6 w-6" />
                <h1 className="text-2xl font-bold">P2P Transfer</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Send KTC to another user</CardTitle>
                    <CardDescription>Enter the recipient's User ID or email and the amount you wish to send.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-end text-sm">
                        <span className="text-muted-foreground mr-2">Available Balance:</span>
                        <div className="font-bold flex items-center gap-1">
                            <Coins className="w-4 h-4 text-yellow-500" />
                            {balance.toLocaleString()} KTC
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="recipient">Recipient</Label>
                        <Input 
                            id="recipient" 
                            placeholder="Enter User ID or email" 
                            value={recipient}
                            onChange={(e) => setRecipient(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="amount">Amount</Label>
                        <div className="relative">
                            <Input 
                                id="amount" 
                                type="number" 
                                placeholder="0.00" 
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="pr-12"
                            />
                            <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm font-semibold text-muted-foreground">
                                KTC
                            </span>
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="note">Note (Optional)</Label>
                        <Textarea 
                            id="note" 
                            placeholder="Add a note for the recipient" 
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                        />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleTransfer} className="w-full" size="lg">
                        Send
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
