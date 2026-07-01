// Seeds the provisioned Supabase database with the cohort people and a set of
// realistic tickets, so a fresh environment has a populated, demo-able app.
// Run with the pulled env: node --env-file=.env.local scripts/seed.mjs
// Idempotent: reruns reset tickets and comments and reuse existing users.

import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Run: vercel env pull .env.local",
  );
  process.exit(1);
}

const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// Shared dev password for the seeded accounts. Local demo only.
const PASSWORD = "deskolas123";

const PEOPLE = [
  { key: "andre", email: "andre@cohort.dev", name: "Andre T.", role: "admin" },
  { key: "maria", email: "maria@cohort.dev", name: "Maria L.", role: "admin" },
  { key: "priya", email: "priya@cohort.dev", name: "Priya S.", role: "member" },
  {
    key: "redeem",
    email: "redeem@cohort.dev",
    name: "Redeem G.",
    role: "member",
  },
  { key: "jose", email: "jose@cohort.dev", name: "Jose R.", role: "member" },
];

async function upsertInvites() {
  const rows = PEOPLE.map((p) => ({ email: p.email, role: p.role }));
  rows.push({ email: "dana@cohort.dev", role: "member" }); // a pending invite
  const { error } = await admin
    .from("invites")
    .upsert(rows, { onConflict: "email" });
  if (error) throw error;
}

async function ensureUsers() {
  const { data, error } = await admin.auth.admin.listUsers({ perPage: 1000 });
  if (error) throw error;
  const byEmail = new Map(data.users.map((u) => [u.email, u.id]));

  const ids = {};
  for (const p of PEOPLE) {
    let id = byEmail.get(p.email);
    if (!id) {
      const created = await admin.auth.admin.createUser({
        email: p.email,
        password: PASSWORD,
        email_confirm: true,
        user_metadata: { full_name: p.name },
      });
      if (created.error) throw created.error;
      id = created.data.user.id;
    }
    ids[p.key] = id;
  }

  // The sign-up trigger created profiles; make sure names and roles are exact.
  for (const p of PEOPLE) {
    const { error: e } = await admin
      .from("profiles")
      .update({ full_name: p.name, role: p.role })
      .eq("id", ids[p.key]);
    if (e) throw e;
  }
  return ids;
}

function tickets(ids) {
  return [
    {
      title: "Can't connect to the lab VM over RDP",
      description:
        "Remote Desktop times out when I try to reach the lab VM from home. It worked yesterday. The host resolves but the connection never completes, even after a reboot.",
      category: "Network and Access",
      priority: "high",
      status: "new",
      submitted_by: ids.priya,
      assigned_to: null,
    },
    {
      title: "git push rejected, SSH key auth failing",
      description:
        "Every push returns Permission denied (publickey). My key is in the agent and added on GitHub, but the cohort repo still refuses it.",
      category: "Git and GitHub",
      priority: "high",
      status: "new",
      submitted_by: ids.redeem,
      assigned_to: null,
    },
    {
      title: "VS Code can't find my Python interpreter",
      description:
        'After the last update, VS Code shows "Select interpreter" and none of my environments appear. Running python3 in the terminal works fine and points to 3.11, but the editor still can\'t run or debug my files.',
      category: "Software and IDE",
      priority: "medium",
      status: "in_progress",
      submitted_by: ids.priya,
      assigned_to: ids.andre,
      comments: [
        {
          author: ids.andre,
          body: 'Open the command palette and run "Python: Select Interpreter", then pick the 3.11 path. If it is missing, what does which python3 return?',
        },
        {
          author: ids.priya,
          body: "It returns /usr/bin/python3 but the editor still shows 2.7. Trying the palette now.",
        },
      ],
    },
    {
      title: "Locked out of the LMS after too many login attempts",
      description:
        "The LMS locked my account after a few wrong passwords. The reset email never arrives and I have an assignment due tonight.",
      category: "Accounts and LMS",
      priority: "low",
      status: "in_progress",
      submitted_by: ids.jose,
      assigned_to: ids.priya,
    },
    {
      title: "Zoom mic not picking up audio in class",
      description:
        "My mic shows no input in Zoom during class. It works in other apps. Classmates can't hear me on calls.",
      category: "Hardware and AV",
      priority: "low",
      status: "resolved",
      submitted_by: ids.jose,
      assigned_to: ids.andre,
      resolution_notes:
        'Switched the input device to the USB headset in Zoom audio settings and turned off "exclusive mode" in Windows sound properties. Mic levels confirmed in the Zoom test call.',
    },
    {
      title: "Campus Wi-Fi keeps dropping every few minutes",
      description:
        "The campus network drops every few minutes on my laptop. Reconnecting works but it happens constantly during labs.",
      category: "Network and Access",
      priority: "medium",
      status: "closed",
      submitted_by: ids.redeem,
      assigned_to: ids.maria,
      resolution_notes:
        "Forgot the saved network and rejoined on the 5GHz band, and updated the Wi-Fi driver. Stable across a full lab session since.",
      is_candidate_article: true,
    },
    {
      title: "Docker won't start on the lab laptop",
      description:
        "Docker Desktop hangs on starting and never finishes. Restarting the laptop did not help. I need it for the container lab.",
      category: "Software and IDE",
      priority: "medium",
      status: "new",
      submitted_by: ids.redeem,
      assigned_to: null,
    },
    {
      title: "Two-factor codes never arrive for the LMS",
      description:
        "The LMS texts a 2FA code on sign-in but it never reaches my phone, so I can't get in. Other texts arrive fine.",
      category: "Accounts and LMS",
      priority: "medium",
      status: "in_progress",
      submitted_by: ids.redeem,
      assigned_to: ids.maria,
    },
  ];
}

async function seedTickets(ids) {
  await admin.from("comments").delete().not("id", "is", null);
  await admin.from("tickets").delete().not("id", "is", null);

  for (const t of tickets(ids)) {
    const { comments, ...ticket } = t;
    const { data, error } = await admin
      .from("tickets")
      .insert(ticket)
      .select("id")
      .single();
    if (error) throw error;

    if (comments?.length) {
      const rows = comments.map((c) => ({
        ticket_id: data.id,
        author_id: c.author,
        body: c.body,
      }));
      const { error: e } = await admin.from("comments").insert(rows);
      if (e) throw e;
    }
  }
}

async function main() {
  await upsertInvites();
  const ids = await ensureUsers();
  await seedTickets(ids);
  console.log("Seed complete.");
  console.log(`Sign in with any cohort email and the password: ${PASSWORD}`);
  console.log("Admins: andre@cohort.dev, maria@cohort.dev");
  console.log("Members: priya@cohort.dev, redeem@cohort.dev, jose@cohort.dev");
}

main().catch((error) => {
  console.error(error.message ?? error);
  process.exit(1);
});
