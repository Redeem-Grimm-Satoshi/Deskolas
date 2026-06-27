import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import type { Database } from "@/types/database";

// Server-side Supabase client bound to the request cookies. Use this in server
// components, route handlers, and server actions. The anon key only: the
// service-role key never reaches a client-bound helper.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // Set from a server component, where cookies are read-only. The
            // middleware refreshes the session cookie on the next request.
          }
        },
      },
    },
  );
}
