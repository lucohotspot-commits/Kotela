
import type {Metadata} from 'next';
import '../globals.css';
import Image from 'next/image';
import Link from 'next/link';
import { Flame } from 'lucide-react';

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
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center py-12">
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
      <div className="hidden bg-muted lg:block">
        <Image
          src="https://picsum.photos/seed/auth-banner/1920/1080"
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          data-ai-hint="login abstract"
        />
      </div>
    </div>
  );
}
