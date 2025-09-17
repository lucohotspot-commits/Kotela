import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Coins, Flame, Home, User, TrendingUp } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Kotela',
  description: 'A simple and engaging tap game.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <header className="sticky top-0 z-30 w-full border-b bg-background/80 backdrop-blur-sm">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <Link href="/" className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Flame className="h-4 w-4" />
                </div>
                <h1 className="text-xl font-bold tracking-tight text-primary font-headline">
                  Kotela
                </h1>
            </Link>
            <nav className="hidden items-center gap-2 md:flex">
              <Button variant="ghost" asChild>
                <Link href="/">
                  <Home className="mr-2" /> Play
                </Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/leaderboard">
                  <Coins className="mr-2" /> Leaderboard
                </Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/ratings">
                  <TrendingUp className="mr-2" /> Ratings
                </Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/profile">
                  <User className="mr-2" /> Profile
                </Link>
              </Button>
            </nav>
          </div>
        </header>
        <main className="container mx-auto flex-grow p-4">{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
