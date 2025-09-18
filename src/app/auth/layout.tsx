
import type {Metadata} from 'next';
import '../globals.css';
import Link from 'next/link';
import { Flame } from 'lucide-react';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'Kotela',
  description: 'A simple and engaging tap game.',
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
       <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Lora:ital,wght@0,400..700;1,400..700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
         <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
        >
            <div className="w-full min-h-screen flex items-center justify-center py-12 px-4 bg-background">
                <div className="mx-auto grid w-[350px] gap-6">
                  <div className="grid gap-2 text-center">
                    <Link href="/" className="flex items-center gap-2 justify-center">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                          <Flame className="h-5 w-5" />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight text-primary font-headline">
                          Kotela
                        </h1>
                    </Link>
                  </div>
                  {children}
                </div>
            </div>
            <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
