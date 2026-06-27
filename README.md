# Deskolas

The cohort help desk. A learner ticketing system for the Per Scholas
AI-Enabled Healthcare IT cohort: learners open tickets for the problems they
hit, classmates pick them up and resolve them, and the best fixes feed the
Learners Hub knowledge base.

<img width="1440" height="900" alt="Ticket queue" src="https://github.com/user-attachments/assets/dff05e23-efcb-4372-a996-594e2e348016" />
<img width="1440" height="900" alt="Ticket detail" src="https://github.com/user-attachments/assets/e53c9e19-03b1-41f2-be5c-931e17803fa2" />
<img width="1440" height="900" alt="Dashboard" src="https://github.com/user-attachments/assets/76792ba5-0d3a-462b-bd83-6830d9b19278" />

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

Vercel builds every pull request as a preview and `main` as production. The root
directory of the Vercel project is this `deskolas/` folder. Branch protection on
`main` requires green CI and one approving review.

## Documentation

- `CLAUDE.md`: locked stack, commands, definition of done, guardrails.
- `CONTRIBUTING.md`: branching, commits, PR rules, how to add a feature on-system.
- `design-guidelines.md`: the living design contract (tokens, components, rules).

The design intent and data model live in the handoff bundle one level up
(`Design_Brief.md`, `Overview.md`, `COMPONENT_INVENTORY.md`, and `screens/`).
