
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function ForgotPasswordPage() {
    return (
        <div className="grid gap-6">
            <div className="grid gap-2 text-center">
                <h1 className="text-2xl font-semibold">Forgot Password</h1>
                <p className="text-balance text-muted-foreground">
                    Enter your email to get a password reset link.
                </p>
            </div>
            <div className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        required
                    />
                </div>
                <Button type="submit" className="w-full">
                    Send Reset Link
                </Button>
            </div>
             <div className="mt-4 text-center text-sm">
                Remembered your password?{" "}
                <Link href="/auth/login" className="underline">
                    Sign in
                </Link>
            </div>
        </div>
    );
}
