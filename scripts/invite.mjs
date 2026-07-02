// Adds an email to the sign-up allowlist from the command line, using the
// service-role key. This is how the FIRST admin gets in (the invites table is
// admin-managed, and no admin exists yet), and the break-glass tool if every
// admin is ever locked out. After this, invites happen in the People screen.
//
//   node --env-file=.env.local scripts/invite.mjs you@example.com admin
//   npm run db:invite -- you@example.com admin
//
// Role defaults to member. The invited person then signs up (email and
// password, or Continue with Google) with that exact email.

import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Run: vercel env pull .env.local",
  );
  process.exit(1);
}

const email = (process.argv[2] ?? "").trim().toLowerCase();
const role = (process.argv[3] ?? "member").trim().toLowerCase();

if (!email || !email.includes("@")) {
  console.error("Usage: npm run db:invite -- email@example.com [member|admin]");
  process.exit(1);
}
if (role !== "member" && role !== "admin") {
  console.error(`Role must be member or admin, got "${role}".`);
  process.exit(1);
}

const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const { error } = await admin
  .from("invites")
  .upsert({ email, role }, { onConflict: "email" });

if (error) {
  console.error(`Could not add the invite: ${error.message}`);
  process.exit(1);
}

console.log(`${email} invited as ${role}.`);
console.log("They sign up with this email (password or Google) to get in.");
