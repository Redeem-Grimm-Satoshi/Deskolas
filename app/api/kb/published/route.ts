// Learners Hub calls this when they publish an article built from one of our
// promoted tickets. We record the article URL on the matching ticket so it can
// show an "In Knowledge Base" link. Server to server, authenticated with a
// shared secret; there is no user session, so the write uses the service role.
import { timingSafeEqual } from "node:crypto";

import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

function secretsMatch(provided: string, expected: string): boolean {
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function POST(request: Request) {
  const secret = process.env.KB_WEBHOOK_SECRET;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!secret || !supabaseUrl || !serviceKey) {
    return NextResponse.json(
      { error: "The Learners Hub webhook is not configured." },
      { status: 503 },
    );
  }

  const provided = request.headers
    .get("authorization")
    ?.replace(/^Bearer\s+/i, "");
  if (!provided || !secretsMatch(provided, secret)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const payload = (await request.json().catch(() => null)) as {
    reference?: string;
    reference_id?: string;
    article_url?: string;
    url?: string;
  } | null;
  const reference = payload?.reference ?? payload?.reference_id;
  const articleUrl = payload?.article_url ?? payload?.url;
  if (!reference || !articleUrl) {
    return NextResponse.json(
      { error: "Missing reference or article_url." },
      { status: 400 },
    );
  }

  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  });
  const { data, error } = await admin
    .from("tickets")
    .update({ kb_article_url: articleUrl })
    .eq("reference", reference)
    .select("id")
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { error: "Could not update the ticket." },
      {
        status: 500,
      },
    );
  }
  if (!data) {
    return NextResponse.json({ error: "Unknown reference." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
