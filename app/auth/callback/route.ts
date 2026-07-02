import { NextResponse, type NextRequest } from "next/server";

import { createClient } from "@/lib/supabase/server";

// Exchanges the OAuth or recovery code for a session, then sends the user on.
// When the invite gate rejects a first-time OAuth user, the account creation is
// aborted in the database and Supabase redirects here with error params instead
// of a code; that lands on the access-denied screen.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (searchParams.get("error")) {
    return NextResponse.redirect(`${origin}/access-denied`);
  }

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${next}`);
  }

  return NextResponse.redirect(`${origin}/sign-in`);
}
