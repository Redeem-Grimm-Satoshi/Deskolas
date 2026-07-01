// Proves the row-level security rules against the live database, using the anon
// key and real sign-ins (no service-role shortcut). Run after the seed:
//   node --env-file=.env.local scripts/verify-rls.mjs
// Invariants of the self-claim model:
//   1. A member can READ a ticket opened by someone else (transparency).
//   2. A member CANNOT edit a ticket they do not own and have not claimed.
//   3. A member CAN claim an open ticket, and then edit it.
// This mutates seed data; rerun the seed to reset.

import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY.",
  );
  process.exit(1);
}

let failures = 0;
function check(label, passed) {
  console.log(`${passed ? "PASS" : "FAIL"}  ${label}`);
  if (!passed) failures += 1;
}

async function signIn(email) {
  const client = createClient(url, anonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { data, error } = await client.auth.signInWithPassword({
    email,
    password: "deskolas123",
  });
  if (error) throw new Error(`sign-in failed for ${email}: ${error.message}`);
  return { client, userId: data.user.id };
}

async function main() {
  const { client: jose, userId: joseId } = await signIn("jose@cohort.dev");

  // A ticket opened by someone else that nobody has claimed.
  const { data: target } = await jose
    .from("tickets")
    .select("id, title, submitted_by, assigned_to")
    .neq("submitted_by", joseId)
    .is("assigned_to", null)
    .limit(1)
    .single();

  check("member can read another member's ticket", Boolean(target));
  if (!target) {
    process.exit(1);
  }

  // Cannot edit a ticket they neither opened nor claimed: RLS filters the row,
  // so the update touches nothing.
  const { data: blocked } = await jose
    .from("tickets")
    .update({ title: "hijacked" })
    .eq("id", target.id)
    .select();
  check("member cannot edit an unclaimed ticket", (blocked?.length ?? 0) === 0);

  // Can claim an open ticket.
  const { error: claimError } = await jose.rpc("claim_ticket", {
    ticket_id: target.id,
  });
  check("member can claim an open ticket", !claimError);

  const { data: afterClaim } = await jose
    .from("tickets")
    .select("assigned_to, status")
    .eq("id", target.id)
    .single();
  check(
    "claim assigns the ticket and moves it to in progress",
    afterClaim?.assigned_to === joseId && afterClaim?.status === "in_progress",
  );

  // Now that they are the claimer, they can edit it.
  const { data: edited } = await jose
    .from("tickets")
    .update({ resolution_notes: "Working on it." })
    .eq("id", target.id)
    .select();
  check("claimer can edit the ticket", (edited?.length ?? 0) === 1);

  // Claiming an already-claimed ticket is rejected.
  const { error: reclaim } = await jose.rpc("claim_ticket", {
    ticket_id: target.id,
  });
  check("claiming an already-claimed ticket is rejected", Boolean(reclaim));

  console.log(
    failures === 0
      ? "\nAll RLS checks passed."
      : `\n${failures} check(s) failed.`,
  );
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((error) => {
  console.error(error.message ?? error);
  process.exit(1);
});
