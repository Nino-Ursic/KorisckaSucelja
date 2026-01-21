import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header, Footer } from '@/components/layout';
import { getSiteContent } from '@/lib/contentful';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Dalmatia Stays - Find Your Perfect Getaway',
  description: 'Discover amazing accommodations in beautiful Dalmatia. From relaxing retreats to adventurous escapes.',
};

async function getUser() {
  try {
    const supabase = createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();
    
    if (!authUser) return null;

    const dbUser = await db.query.users.findFirst({
      where: eq(users.id, authUser.id),
    });

    if (!dbUser) return null;

    return {
      email: dbUser.email,
      role: dbUser.role,
    };
  } catch {
    return null;
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const siteContent = await getSiteContent();
  const user = await getUser();

  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <Header siteContent={siteContent} user={user} />
        <main className="flex-grow bg-gray-950">{children}</main>
        <Footer appName={siteContent.appName} />
      </body>
    </html>
  );
}
