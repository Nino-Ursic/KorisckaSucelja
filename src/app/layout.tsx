import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header, Footer } from '@/components/layout';
import { getSiteContent } from '@/lib/contentful';
import HeaderWrapper from '@/components/layout/HeaderWrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Dalmatia Stays - Find Your Perfect Getaway',
  description: 'Discover amazing accommodations in beautiful Dalmatia. From relaxing retreats to adventurous escapes.',
};


export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <HeaderWrapper />
        {children}
      </body>
    </html>
  );
}

