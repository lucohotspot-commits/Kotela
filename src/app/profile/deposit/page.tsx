
"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { ChevronRight, Upload, Copy, AlertTriangle, QrCode } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const walletAddresses: { [key: string]: string } = {
    eth: "0x1a2b3c4d5e6f7g8h9i0jabcde12345fgh67890",
    sol: "SoL1a2b3c4d5e6f7g8h9i0jabcde12345fgh67890",
    btc: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    bnb: "bnb1a2b3c4d5e6f7g8h9i0jabcde12345fgh67890",
};

const networks = [
    { id: 'eth', name: 'Ethereum (KTC)' },
    { id: 'sol', name: 'Solana' },
    { id: 'btc', name: 'Bitcoin' },
    { id: 'bnb', name: 'BNB Smart Chain' },
];

export default function DepositPage() {
    const [selectedNetwork, setSelectedNetwork] = useState('eth');
    const { toast } = useToast();
    
    const walletAddress = walletAddresses[selectedNetwork];

    const handleCopy = () => {
        navigator.clipboard.writeText(walletAddress);
        toast({
            title: "Copied!",
            description: "Wallet address copied to clipboard.",
        });
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
                        <BreadcrumbPage>Deposit</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            
            <Card>
                <CardHeader>
                    <CardTitle className='flex items-center gap-2'>
                        <Upload />
                        Deposit KTC
                    </CardTitle>
                    <CardDescription>Select a network and send crypto to the address below.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="network" className="text-sm font-medium">Network</label>
                         <Select onValueChange={setSelectedNetwork} value={selectedNetwork}>
                            <SelectTrigger id="network">
                                <SelectValue placeholder="Select a network" />
                            </SelectTrigger>
                            <SelectContent>
                                {networks.map(network => (
                                    <SelectItem key={network.id} value={network.id}>
                                        {network.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="text-center space-y-4 p-6 bg-muted rounded-lg">
                        <div className="bg-white p-4 inline-block rounded-lg shadow-md">
                           <QrCode className="w-40 h-40" />
                        </div>
                        <div>
                             <p className="text-sm text-muted-foreground mt-4">Your {networks.find(n => n.id === selectedNetwork)?.name} Address</p>
                            <p className="text-sm font-mono break-all my-2">{walletAddress}</p>
                            <Button variant="ghost" onClick={handleCopy} className="text-primary">
                                <Copy className="mr-2" />
                                Copy Address
                            </Button>
                        </div>
                    </div>
                    
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Important</AlertTitle>
                      <AlertDescription>
                          <ul className="list-disc list-inside space-y-1">
                              <li>Only send {networks.find(n => n.id === selectedNetwork)?.name.split(' ')[0]} to this address.</li>
                              <li>Ensure the network you choose to deposit from matches the network you've selected above.</li>
                          </ul>
                      </AlertDescription>
                    </Alert>

                </CardContent>
            </Card>
        </div>
    );
}

