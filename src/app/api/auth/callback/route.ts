import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const role = (searchParams.get("role") || "guest") as "guest" | "host";
  const next = searchParams.get("next");

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && data.user) {
      try {
        const existingUser = await db.query.users.findFirst({
          where: eq(users.id, data.user.id),
        });

        if (!existingUser) {
          const fullName = data.user.user_metadata?.full_name || 
                          data.user.user_metadata?.name ||
                          data.user.email?.split('@')[0] || 
                          'User';

          await db.insert(users).values({
            id: data.user.id,
            email: data.user.email!,
            fullName,
            role,
          });
        }

        const forwardedHost = request.headers.get("x-forwarded-host");
        const isLocalEnv = process.env.NODE_ENV === "development";
        
        const userRole = existingUser?.role || role;
        const redirectPath = next || (userRole === 'host' ? '/dashboard/host' : '/dashboard/guest');
        
        if (isLocalEnv) {
          return NextResponse.redirect(`${origin}${redirectPath}`);
        } else if (forwardedHost) {
          return NextResponse.redirect(`https://${forwardedHost}${redirectPath}`);
        } else {
          return NextResponse.redirect(`${origin}${redirectPath}`);
        }
      } catch (dbError) {
        console.error('Database error during OAuth callback:', dbError);
        const redirectPath = role === 'host' ? '/dashboard/host' : '/dashboard/guest';
        return NextResponse.redirect(`${origin}${redirectPath}`);
      }
    }
  }

  return NextResponse.redirect(`${origin}/auth/login?error=auth_callback_error`);
}
