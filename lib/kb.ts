// Server-only client for the Learners Hub knowledge base handoff. When an admin
// promotes a resolved ticket, we POST it to the Learners Hub submissions API
// (their Supabase REST endpoint). The reference (PS-####) is the idempotency
// key: their table rejects duplicates, so a retry never creates a second row.
//
// Configured with server-only env vars (see .env.example): KB_SUBMISSIONS_URL
// and KB_API_KEY. These are not NEXT_PUBLIC, so they are only present on the
// server; import this module from server actions and route handlers only. When
// they are unset the handoff is treated as not configured and promote still
// records the local candidate flag.

export type KbTicket = {
  reference: string;
  title: string;
  problem: string;
  solution: string;
  category: string;
  resolvedBy: string;
  sourceUrl: string;
};

export type KbSubmitResult =
  | { ok: true; submissionId: string | null; duplicate: boolean }
  | { ok: false; error: string };

function config(): { url: string; key: string } | null {
  const url = process.env.KB_SUBMISSIONS_URL;
  const key = process.env.KB_API_KEY;
  if (!url || !key) return null;
  return { url, key };
}

export function kbConfigured(): boolean {
  return config() !== null;
}

// Their schema wants one content field; keep the problem and solution labelled
// so the reviewer sees both.
function buildContent(problem: string, solution: string): string {
  const parts: string[] = [];
  if (problem.trim()) parts.push(`Problem: ${problem.trim()}`);
  if (solution.trim()) parts.push(`Solution: ${solution.trim()}`);
  return parts.join("\n\n");
}

const MAX_ATTEMPTS = 3;

export async function submitToKb(ticket: KbTicket): Promise<KbSubmitResult> {
  const cfg = config();
  if (!cfg) {
    return {
      ok: false,
      error: "The Learners Hub handoff is not configured yet.",
    };
  }

  const body = JSON.stringify({
    type: "Resolved Ticket",
    title: ticket.title,
    content: buildContent(ticket.problem, ticket.solution),
    track: ticket.category,
    author: ticket.resolvedBy,
    // Same person as author; their table requires full_name (it drives the
    // Wall of Fame placard) and rejects rows without it.
    full_name: ticket.resolvedBy,
    url: ticket.sourceUrl,
    reference_id: ticket.reference,
  });

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    let retryable = false;
    try {
      const res = await fetch(cfg.url, {
        method: "POST",
        headers: {
          apikey: cfg.key,
          Authorization: `Bearer ${cfg.key}`,
          "Content-Type": "application/json",
          // Ask their Supabase REST to return the inserted row so we get the id.
          Prefer: "return=representation",
        },
        body,
      });

      // A duplicate reference means it is already in their queue: idempotent win.
      if (res.status === 409) {
        return { ok: true, submissionId: null, duplicate: true };
      }
      if (res.ok) {
        const rows = (await res.json().catch(() => null)) as
          { id?: string }[] | null;
        const submissionId = Array.isArray(rows) ? (rows[0]?.id ?? null) : null;
        return { ok: true, submissionId, duplicate: false };
      }
      // Client errors will not fix themselves; do not burn retries on them.
      if (res.status < 500) {
        return {
          ok: false,
          error: `Learners Hub rejected the submission (${res.status}).`,
        };
      }
      retryable = true;
    } catch {
      // Network failure: retry.
      retryable = true;
    }

    if (retryable && attempt < MAX_ATTEMPTS) {
      await new Promise((resolve) =>
        setTimeout(resolve, 300 * 2 ** (attempt - 1)),
      );
    }
  }

  return {
    ok: false,
    error:
      "Could not reach Learners Hub. The ticket is marked a candidate; try again.",
  };
}
