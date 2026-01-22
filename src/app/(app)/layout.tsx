import { Inter } from 'next/font/google';
import { Header, Footer } from '@/components/layout';
import HeaderWrapper from '@/components/layout/HeaderWrapper';
import { getSiteContent } from '@/lib/contentful';

const inter = Inter({ subsets: ['latin'] });

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const siteContent = await getSiteContent();

  return (
    <div className={`${inter.className} min-h-screen flex flex-col bg-gray-950`}>
      <HeaderWrapper siteContent={siteContent} />
      <main className="flex-grow">{children}</main>
      <Footer appName={siteContent.appName} />
    </div>
  );
}