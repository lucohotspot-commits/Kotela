
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function RegisterPage() {
    const [phoneVerificationStatus, setPhoneVerificationStatus] = useState<'unverified' | 'code-sent' | 'verified'>('unverified');
    const { toast } = useToast();

    const handleSendCode = () => {
        // In a real app, this would trigger an API call to send an SMS
        setPhoneVerificationStatus('code-sent');
        toast({
            title: 'Verification Code Sent',
            description: 'A code has been sent to your phone number.',
        });
    };

    const handleVerifyCode = () => {
        // In a real app, this would verify the code with the backend
        setPhoneVerificationStatus('verified');
        toast({
            title: 'Phone Number Verified',
            description: 'Your phone number has been successfully verified.',
        });
    };

    return (
        <div className="grid gap-6">
            <div className="grid gap-2 text-left">
                <h1 className="text-2xl font-bold">Sign Up</h1>
                <p className="text-sm text-muted-foreground">
                    Enter your information to create an account
                </p>
            </div>
            <div className="grid gap-4">
                 <div className="grid gap-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                        id="username"
                        type="text"
                        placeholder="yourusername"
                        required
                    />
                </div>
                 <div className="grid gap-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="flex gap-2">
                        <Input
                            id="phone"
                            type="tel"
                            placeholder="+1 234 567 890"
                            required
                            disabled={phoneVerificationStatus === 'verified' || phoneVerificationStatus === 'code-sent'}
                        />
                         {phoneVerificationStatus === 'unverified' && (
                            <Button variant="outline" onClick={handleSendCode}>Send Code</Button>
                        )}
                        {phoneVerificationStatus === 'verified' && (
                           <div className="flex items-center gap-2 text-green-600 font-semibold text-sm pr-2">
                                <CheckCircle2 className="h-5 w-5" />
                                Verified
                           </div>
                        )}
                    </div>
                </div>

                {phoneVerificationStatus === 'code-sent' && (
                    <div className="grid gap-2 animate-in fade-in-50">
                        <Label htmlFor="verification-code">Verification Code</Label>
                        <div className="flex gap-2">
                            <Input
                                id="verification-code"
                                type="text"
                                placeholder="Enter 6-digit code"
                                required
                            />
                            <Button onClick={handleVerifyCode}>Verify</Button>
                        </div>
                    </div>
                )}

                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        required
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" required />
                </div>
                 <div className="grid gap-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input id="confirm-password" type="password" required />
                </div>
                <Button type="submit" className="w-full" disabled={phoneVerificationStatus !== 'verified'}>
                    Create an account
                </Button>
            </div>
            <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <Link href="/auth/login" className="underline">
                    Sign in
                </Link>
            </div>
        </div>
    );
}
