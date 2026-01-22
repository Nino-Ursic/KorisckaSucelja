import { Header } from './Header';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getSiteContent } from '@/lib/contentful';

export default async function HeaderWrapper() {
  const siteContent = await getSiteContent();

  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();

  let user = null;

  if (authUser) {
    const dbUser = await db.query.users.findFirst({
      where: eq(users.id, authUser.id),
    });

    if (dbUser) {
      user = {
        email: dbUser.email,
        role: dbUser.role,
      };
    }
  }

  return <Header siteContent={siteContent} user={user} />;
}
