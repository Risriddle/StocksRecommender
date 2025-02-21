import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import Navbar from '@/components/Navbar';
import { ToastProvider, ToastViewport } from '@/components/ui/toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Stock Recommendation System',
  description: 'Advanced stock recommendations and portfolio management',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
           {/* <ToastProvider>
      {children}
      <ToastViewport />
    </ToastProvider> */}
        </Providers>
      </body>
    </html>
  );
}










