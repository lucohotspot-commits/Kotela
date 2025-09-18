
"use client"

import { usePathname } from 'next/navigation';
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Link from 'next/link';
import { Flame } from 'lucide-react';
import { MobileNav } from '@/components/mobile-nav';
import { DesktopNav } from '@/components/desktop-nav';
import { ThemeProvider } from '@/components/theme-provider';
import { NotificationTicker } from '@/components/notification-ticker';
import { GameProvider } from '@/context/GameContext';


// Metadata cannot be conditional, so we define it statically.
// We can use a more generic title here and specify more detailed
// titles in the page components themselves.
// export const metadata: Metadata = {
//   title: 'Kotela',
//   description: 'A simple and engaging tap game.',
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith('/auth');

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Kotela</title>
      </head>
      <body>
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
        >
          <GameProvider>
            <div className="relative flex min-h-screen flex-col">
              {!isAuthPage && (
                <header className="sticky top-0 z-30 w-full border-b bg-background/80 backdrop-blur-sm">
                  <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground">
                          <Flame className="h-4 w-4" />
                        </div>
                        <h1 className="text-xl font-bold tracking-tight text-primary">
                          Kotela
                        </h1>
                    </Link>
                    <DesktopNav />
                  </div>
                </header>
              )}
              {!isAuthPage && <NotificationTicker />}
              <main className="flex-grow">
                {isAuthPage ? (
                  children
                ) : (
                  <div className="container mx-auto p-4 pb-20 md:pb-4">
                    {children}
                  </div>
                )}
              </main>
              {!isAuthPage && <MobileNav />}
              <Toaster />
            </div>
          </GameProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
