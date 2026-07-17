# Deskolas roadmap

Where the project has been, what is happening right now, and where it goes
next. Written for everyone on the team, technical or not. When priorities
change, this file changes with them, so if you are ever unsure what to work on
or why something matters, start here.

How to read it: **Shipped** is done and live. **Now** is being worked on this
week. **Next** is queued and scoped. **Later** is real but parked. The change
log in `DOCUMENTATION.md` has the fine detail behind everything in Shipped.

## The one-paragraph story

Deskolas started as a design system and a set of screens, grew a real backend
with sign-in and live data, then became a live product: tickets update in real
time, people have profiles and notifications, and our best resolved tickets
flow automatically into the Learners Hub knowledge base run by the KB team. The
app is deployed and usable today at https://deskolas.vercel.app. What remains
is polish, insight (helping instructors see trends), and getting ready for the
real cohort to move in.

## Shipped

- **Design system and every screen.** The token-driven component library
  (dark and light), the queue, ticket detail, dashboard, people, settings, and
  auth screens. Browse it live at `/components`.
- **Accounts and sign-in.** Invite-only membership (an allowlist admins
  manage), password and Google sign-in, two roles (member and admin), and
  database-level security so the rules hold even if the UI has a bug.
- **The living app.** Real tickets with self-claim (anyone can pick up any open
  ticket), comments, statuses, priorities, reassignment, and admin oversight.
- **Realtime.** New tickets and comments appear without refreshing. The bell
  shows real notifications the moment something relevant happens to you.
- **Profile photos.** Upload in Settings; your photo follows you across the
  app.
- **Knowledge base integration.** Promote a resolved ticket and it lands in
  the Learners Hub review queue; when they publish, the ticket links to the
  article. Live-tested with the KB team on July 3, ahead of the July 6 target.
- **Team onboarding.** The starter-issue board (difficulty-labeled, frontend
  only), branch protection so nothing merges unreviewed, the contributor guide
  in the README, and six starter issues already shipped by three contributors.

## Now

- **Security hardening** (project owner). Closing a small avatar-upload
  loophole found in review, and rotating the demo account passwords before the
  real cohort arrives.
- **Starter issues, wave two** (open to the team, see the board):
  - #20 Copy link button on ticket detail (medium)
  - #23 New ticket dialog keeps your draft (medium)
  - #21 Shareable queue filters in the URL (hard)
  - #22 Loading skeletons for the app screens (hard)

## Next

- **Instructor trends dashboard.** The dashboard grows a time dimension so
  instructors can see what the cohort is struggling with this week, not just
  right now: week-over-week deltas on the tiles, a 14-day new-tickets
  sparkline, trending categories, and a list of tickets stuck too long. Scoped
  and ready to build; no new dependencies.
- **Honest resolution times.** A small database addition (`resolved_at`) so
  "median time to resolve" measures the real thing instead of approximating.
- **Cohort launch checklist.** Wipe the demo tickets and accounts, invite the
  real roster, and confirm every teammate has the access they need. The switch
  we flip when the real cohort moves in.

## Later

- **Weekly summary email.** The Settings toggle exists; the sending does not.
  Needs an email provider decision first.
- **KB deflection metric.** After an article publishes, do tickets in that
  category actually go down? One number that proves the knowledge base loop
  works, and a great story for both teams.
- **Custom domain.** Also upgrades the Google sign-in screen to say "Deskolas"
  instead of the raw Supabase address. Costs money, purely cosmetic, parked.
- **Accessibility and test hardening.** A deeper pass with axe and more
  end-to-end coverage as the app stabilizes.

## How the team fits in

The ladder so far: easy fixes teach the workflow, mediums teach the codebase,
hards teach the craft. Six issues have been shipped by Sumaia, Dana, and
Chanel, and the four open ones above are the next rungs. Claim an issue by
commenting on it, branch from the latest `main`, and one pull request per
issue. New starter issues get opened as the app grows, so the board refills.

Frontend is the team's lane by agreement: anything in `supabase/`, server
actions, or `app/api/` is the project owner's, and branch protection enforces
that every change gets an owner review before it lands.
