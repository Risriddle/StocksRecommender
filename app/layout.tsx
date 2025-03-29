import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import Navbar from '@/components/Navbar';
import { DisclaimerBanner } from "@/components/disclaimer-banner";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "10xStx - AI-Powered Stock Insights & Analysis",
  description:
    "Discover stocks to track with advanced data analysis, AI insights, and expert analysis beyond the headlines.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className}min-h-screen flex flex-col`}>
        <Providers>
          <Navbar />
          {/* <div className="container mx-auto px-4 py-2">
      <DisclaimerBanner />
    </div> */}
          {/* <main className="container mx-auto px-4 py-8"> */}
          <main className="flex-1 pb-16">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>

  );
}








