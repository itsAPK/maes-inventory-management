import type { Metadata } from 'next';
import { Inter, Nunito_Sans } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Providers } from './provider';
import UILayout from '@/components/ui-layout';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Madhav Auto and Energy Solutions',
  description: 'Madhav Auto and Energy Solutions Inventory Management',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn('max-w-[100%] overflow-x-hidden font-sans', inter.className)}>
        <Providers>
          <UILayout>{children}</UILayout>
        </Providers>
      </body>
    </html>
  );
}
