import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Link from 'next/link';
import { Flame } from 'lucide-react';
import { MobileNav } from '@/components/mobile-nav';
import { DesktopNav } from '@/components/desktop-nav';
import { ThemeProvider } from '@/components/theme-provider';

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
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
        >
            <div className="relative flex min-h-screen flex-col">
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
                  <DesktopNav />
                </div>
              </header>
              <main className="container mx-auto flex-grow p-4 pb-20 md:pb-4">{children}</main>
              <MobileNav />
              <Toaster />
            </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
