# Deskolas documentation

A living record of how Deskolas is built and what has changed, written for the
engineers who pick it up. For the rules of the road see `CLAUDE.md`, for setup
see `README.md`, and for the design system see `design-guidelines.md`.

## What Deskolas is

The cohort help desk: a learner ticketing system for the Per Scholas
AI-Enabled Healthcare IT cohort. Learners open tickets, classmates and admins
work them through a lifecycle (new, in progress, resolved, closed), and the best
fixes are flagged to feed the Learners Hub knowledge base.

## Access model (self-serve, autonomous)

The system is built to run without a human triaging or assigning work. It is a
pull board, not a push queue.

- **Two roles: member and admin.** A member is anyone with an account. An admin
  is a member plus oversight (manage people and invites, force actions, promote
  to the knowledge base, see the metrics dashboard).
- **Self-claim, no assigner.** Nobody hands out tickets. Anyone signed in
  (students, alumni, instructors, any Per Scholas person) can claim any open
  ticket and resolve it. Admins do not assign.
- **Transparency.** Everyone signed in can read every ticket, which is what makes
  claiming possible. Edit and resolve are limited to the ticket's opener, the
  person who claimed it, and admins. That is the row-level security rule in
  Phase 2.
- **Invite-only accounts.** There is no single email domain to gate on (only
  staff have `perscholas.org`; students use personal emails), so sign-up is an
  allowlist: an admin or instructor adds people or imports the roster, and only
  listed emails can register.

The knowledge base handoff is documented in `docs/kb-integration.md`.

## Architecture

- Next.js (App Router) with TypeScript. Route groups split the unauthenticated
  `(auth)` screens from the authenticated `(app)` shell.
- Tailwind CSS v4 with a CSS-first theme. Every design token lives once in
  `app/globals.css` under `@theme`. Dark is the base; a `light` class on the
  document swaps the token layer. Components read semantic tokens
  (`bg-surface`, `text-text-2`, `border-border`), never raw hex.
- Radix UI primitives, restyled to the tokens, back the interactive components
  (dialog, select, dropdown, popover, switch, checkbox, toast, avatar).
- lucide-react for icons at a 1.5px stroke. The brand mark is the D monogram
  (`components/ui/logo.tsx`), never the lucide Ticket glyph.

### Folder map

```
app/
  (auth)/        sign-in, create-account, forgot-password, check-email,
                 set-new-password, access-denied
  (app)/         authenticated shell (sidebar + top bar)
    dashboard/   admin landing
    tickets/     queue + [id] detail
    my-tickets/  learner landing
    people/      admin roles and invites
    settings/    profile and notifications
  components/    the /components library showcase
  not-found.tsx  404
components/
  ui/            token-themed primitives (button, input, select, ticket bits...)
  tickets/       feature components (ticket card, new-ticket dialog, promote)
  app/           shell pieces (sidebar, top bar, user menu, notifications)
  providers/     theme and mock session providers
lib/
  mock-data.ts   preview data layer (replaced by Supabase in Phase 2)
  tickets.ts     status, priority, category vocabulary
  ticket-view.ts sort and card-prop helpers, spine color map
  validations/   zod schemas shared by client and (later) server
  styles.ts      shared focus-ring class
  utils.ts       cn() class merge
supabase/        migrations and seed (filled in Phase 2)
brand/           logo and icon source assets
```

## Build phases

The handoff plan builds in checkpointed phases. Status:

- Phase 0, scaffold: complete. Next plus tooling, the five docs, CI, the
  fingerprint guard, and the design-token foundation.
- Phase 1, design system in code: complete. The `components/ui` library built to
  `COMPONENT_INVENTORY.md`, in dark and light, viewable at `/components`.
- Phase 3, screens: complete on mock data (built ahead of Phase 2 so the app is
  clickable early). Every designed screen is implemented and faithful to its
  frame in `screens/`.
- Phase 2, Supabase: in progress. The database foundation is done (schema,
  row-level security, the invite gate, the seed, and a passing RLS check against
  the live database; see the Database section). Still to come: wiring real auth
  and swapping the mock data for live queries.

## Database

Supabase is provisioned through the Supabase integration on Vercel, so there is
one hosted database that development and production share. No local Docker stack.
Pull the keys with `vercel env pull .env.local`.

Schema (`supabase/migrations`):

- `profiles`: one row per auth user, `role` is member or admin.
- `tickets`: the ticket, with a generated `reference` (PS-0001 style) that is the
  join key for the knowledge base handoff, plus the two KB-bridge fields.
- `comments`: the per-ticket thread.
- `invites`: the sign-up allowlist.

Row-level security enforces the self-claim access model:

- Anyone signed in can read every ticket, profile, and comment.
- A ticket is editable only by its opener, the person who claimed it, or an
  admin. Members claim an open ticket through the `claim_ticket` function
  (security definer), which is the only way to take a ticket you do not own.
- Sign-up is invite-only: a trigger on new auth users creates a profile only if
  the email is in `invites`, and rejects anyone who is not. Email and OAuth both
  flow through it.

Workflow:

- `npm run db:push` applies migrations to the database (uses the direct
  connection string).
- `npm run db:seed` loads the cohort people and a set of tickets. It prints the
  demo sign-in credentials.
- `npm run db:verify` runs the RLS checks against the live database (read-all
  allowed, editing someone else's ticket blocked, claim works).

Types live in `types/database.ts`. The CLI generator needs Docker, which we
avoid, so the types are kept in sync with the migrations by hand for now; the
file documents how to regenerate once a Supabase access token is configured.

## The mock preview layer (temporary)

The screens currently run on a stand-in layer so they can be reviewed before the
backend exists. This is deliberately throwaway and gets removed in Phase 2.

- `lib/mock-data.ts` holds profiles, tickets (PS-0001 through PS-0011), comments,
  activity, notifications, and the dashboard summary. Times are stored as the
  exact labels the frames show, not timestamps.
- `components/providers/session-provider.tsx` is a mock session. It sets the
  current user and exposes a "View as" switch (in the sidebar user menu) so you
  can preview both the admin and learner experiences. Default is admin.
- Nothing persists. Sign-in does not authenticate, status changes are local
  component state, and form submits show a toast rather than writing data.
- The ticket detail reflects the self-claim access model: anyone can read a
  ticket, an open ticket shows a Claim button, and once you claim it (or if you
  are an admin) you get the status and resolution controls. This mirrors the
  row-level security policy that will enforce it in the database.

When Phase 2 lands, the screens keep their shape: server components and server
actions read Supabase, the mock session becomes the real session, and
`types/database.ts` is generated from the schema.

## Conventions

- Server components by default; `"use client"` only where interaction needs it.
  The preview screens are client components because they drive local state and
  the role switch; they convert back as data moves server-side in Phase 2.
- Forms validate with zod (`lib/validations`), and the schema is shared so the
  same rules run on the client and the server.
- No raw hex or one-off sizes; tokens only. No em dashes and no AI attribution
  anywhere. The pre-commit hook and CI enforce both.
- Every change ships green: `lint`, `typecheck`, `build`, `test`, and the
  relevant `test:e2e`.

## Change log

- 2026-06-27, Phase 0: scaffold, tooling, CI, docs, design tokens.
- 2026-06-27, Phase 1: component library and the `/components` showcase.
- 2026-06-28, brand fix: replaced the placeholder mark with the approved D
  monogram and wired the favicons.
- 2026-06-28, Phase 3 (preview): all application screens on the mock data layer,
  the authenticated shell, and the new-ticket and promote flows.
- 2026-06-28, access model: switched to autonomous self-claim (anyone can claim
  and resolve any open ticket, admins oversee), opened the ticket board to
  everyone, added the Claim action, retired the in-app access-denied screen, and
  moved to invite-only accounts. Added `docs/kb-integration.md` for the Learners
  Hub handoff.
- 2026-06-28, chrome: added the dark and light theme toggle to the top bar,
  ticket detail header, and auth screens, and made the ticket assignee editable
  so admins can reassign to any member or unassign.
- 2026-07-01, Phase 2 database: provisioned Supabase through the Vercel
  integration, added the schema migration, row-level security, the invite gate
  and self-claim function, the seed, typed database definitions, and an RLS
  verification that passes against the live database.
