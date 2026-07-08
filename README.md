# Deskolas

The cohort help desk. A learner ticketing system for the Per Scholas
AI-Enabled Healthcare IT cohort: learners open tickets for the problems they
hit, classmates pick them up and resolve them, and the best fixes feed the
Learners Hub knowledge base.

<img width="1440" height="900" alt="Ticket queue" src="https://github.com/user-attachments/assets/dff05e23-efcb-4372-a996-594e2e348016" />

## Design System

[Deskolas Design System.pdf](https://github.com/user-attachments/files/29555947/Deskolas.Design.System.pdf)

## Stack

- Next.js (App Router) and TypeScript, server components by default
- Tailwind CSS themed to the design tokens, Radix UI via shadcn/ui, lucide-react
- Supabase for Postgres, Auth, Storage, and Row-Level Security
- react-hook-form and zod for forms and validation
- Vitest and React Testing Library, Playwright, axe for tests and accessibility
- Hosted on Vercel with preview deploys per pull request

See `CLAUDE.md` for the full locked stack and the rules that keep the codebase
consistent.

## Setup

Requires Node 20 or newer.

```
npm install
cp .env.example .env.local   # then fill in the values
npm run dev
```

Open http://localhost:3000.

## Contributing for the first time

1. Clone the repository, switch into the app folder, and run `npm install`.
   Deskolas needs Node 20 or newer.
2. Ask the project owner for two things: the private `.env.local` file and an
   app invite plus demo sign in credentials. Supabase keys are required to run
   the app and are not committed on purpose.
3. Start the app with `npm run dev`, then open http://localhost:3000.
4. Visit http://localhost:3000/components before changing UI. It shows the
   design system building blocks you should reuse.
5. Pick an issue labeled `easy fix`, comment so nobody duplicates the work, and
   branch from `main`. Use a short name like `fix/issue-13-placeholders`.
6. Before opening a pull request, run `npm run lint`, `npm run typecheck`,
   `npm run test`, and `npm run build`. All must pass, and the pre-commit hook
   will also check formatting and fingerprints.
7. Open one pull request per issue and mention the issue number, for example
   `Closes #13`. Never push directly to `main`.
8. Read `CLAUDE.md` before coding. The two rules that surprise new contributors
   most are design tokens only and no em dashes anywhere.

## Environment

Every required variable is documented in `.env.example`. The short version:

- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`: public, safe in
  the browser.
- `SUPABASE_SERVICE_ROLE_KEY`: secret, server-side only, never `NEXT_PUBLIC`.
- `NEXT_PUBLIC_SITE_URL`: the app base URL, used for auth redirects.

In production these live in the Vercel project settings, not in a committed file.

## Commands

```
npm run dev          # local dev server
npm run build        # production build
npm run lint         # eslint
npm run typecheck    # tsc --noEmit
npm run test         # vitest unit and component tests
npm run test:e2e     # playwright end to end
npm run format       # prettier write
```

All of these pass before any change is considered done.

## Supabase

Migrations, RLS policies, and the seed script live in `supabase/`. The data
layer (auth, roles, typed queries) lands in Phase 2; until then the helpers in
`lib/supabase/` are in place and the app runs without live credentials.

When a local stack is in use:

```
npx supabase start                                   # local Postgres and auth
npx supabase db reset                                # apply migrations and seed
npx supabase gen types typescript --local > types/database.ts
```

## Deploy

Vercel builds every pull request as a preview and `main` as production. This
app is the repository root, so the Vercel project root directory is the default
(no subfolder). Branch protection on `main` requires green CI and one approving
review.

## Documentation

- `CLAUDE.md`: locked stack, commands, definition of done, guardrails.
- `CONTRIBUTING.md`: branching, commits, PR rules, how to add a feature on-system.
- `design-guidelines.md`: the living design contract (tokens, components, rules).

The design intent and data model live in the handoff bundle one level up
(`Design_Brief.md`, `Overview.md`, `COMPONENT_INVENTORY.md`, and `screens/`).
