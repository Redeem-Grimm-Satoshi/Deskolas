// Learners Hub calls this when they publish an article built from one of our
// promoted tickets. We record the article URL on the matching ticket so it can
// show an "In Knowledge Base" link. Server to server, authenticated with a
// shared secret; there is no user session, so the write uses the service role.
//
// Two payload shapes are accepted:
// 1. Flat: { reference, article_url } (aliases: reference_id, url).
// 2. The raw Supabase Database Webhook envelope from their submissions table:
//    { type: "UPDATE", record: {...row}, old_record: {...} }. That webhook
//    fires on every update, so non-published rows are acknowledged and
//    ignored. In envelope mode record.url is never used as the article URL,
//    because that column holds the Deskolas ticket link we sent them.
import { timingSafeEqual } from "node:crypto";

import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

function secretsMatch(provided: string, expected: string): boolean {
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

const ARTICLE_URL_COLUMNS = [
  "article_url",
  "published_url",
  "public_url",
  "live_url",
  "publishedUrl",
];

type SubmissionRow = Record<string, unknown>;

function asString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value : undefined;
}

function parsePublish(payload: unknown): {
  reference?: string;
  articleUrl?: string;
  ignored?: string;
  badEnvelope?: string[];
} {
  if (!payload || typeof payload !== "object") return {};
  const body = payload as Record<string, unknown>;

  const record = body.record as SubmissionRow | undefined;
  if (record && typeof record === "object") {
    const status = asString(record.status)?.toLowerCase();
    if (status && status !== "published") {
      return { ignored: `status is ${status}` };
    }
    const reference =
      asString(record.reference_id) ?? asString(record.reference);
    const articleUrl = ARTICLE_URL_COLUMNS.map((column) =>
      asString(record[column]),
    ).find(Boolean);
    if (reference && articleUrl) return { reference, articleUrl };
    return { badEnvelope: Object.keys(record) };
  }

  return {
    reference: asString(body.reference) ?? asString(body.reference_id),
    articleUrl: asString(body.article_url) ?? asString(body.url),
  };
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

  const payload = await request.json().catch(() => null);
  const { reference, articleUrl, ignored, badEnvelope } = parsePublish(payload);

  // Their raw webhook fires on every row change; a non-published update is
  // fine and must be acknowledged, or their side would retry it forever.
  if (ignored) {
    return NextResponse.json({ ok: true, ignored });
  }
  if (badEnvelope) {
    // Echo the column names (never values) so a mismatch is debuggable from
    // their webhook logs during the integration test.
    return NextResponse.json(
      {
        error:
          "Could not find the reference or the published article URL in the record.",
        expected: {
          reference: ["reference_id", "reference"],
          articleUrl: ARTICLE_URL_COLUMNS,
        },
        recordColumns: badEnvelope,
      },
      { status: 422 },
    );
  }
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
      { status: 500 },
    );
  }
  if (!data) {
    return NextResponse.json({ error: "Unknown reference." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
