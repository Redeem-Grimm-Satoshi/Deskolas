# Deskolas

The cohort help desk. A learner ticketing system for the Per Scholas
AI-Enabled Healthcare IT cohort: learners open tickets for the problems they
hit, classmates pick them up and resolve them, and the best fixes feed the
Learners Hub knowledge base.

<img width="1440" height="900" alt="Ticket queue" src="https://github.com/user-attachments/assets/dff05e23-efcb-4372-a996-594e2e348016" />

## Stack

- Next.js (App Router) and TypeScript, server components by default
- Tailwind CSS themed to the design tokens, Radix UI via shadcn/ui, lucide-react
- Supabase for Postgres, Auth, Storage, and Row-Level Security
- react-hook-form and zod for forms and validation
- Vitest and React Testing Library, Playwright, axe for tests and accessibility
- Hosted on Vercel with preview deploys per pull request

See `CLAUDE.md` for the full locked stack and the rules that keep the codebase
consistent.

## Getting started

Requires Node 20 or newer.

```bash
git clone https://github.com/Redeem-Grimm-Satoshi/Deskolas.git
cd Deskolas
npm install
npm run dev
```

The app needs a `.env.local` with the Supabase values before it will run. They
are intentionally not in the repository: the project owner pulls them from
Vercel (`vercel env pull .env.local`), and teammates ask the owner for them.

Then open http://localhost:3000. The design system lives at
http://localhost:3000/components and is worth a tour before touching code: it
shows every building block the screens are made of.

## Environment

Every variable is documented in `.env.example`. The short version:

- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`: public, safe in
  the browser.
- `SUPABASE_SERVICE_ROLE_KEY`: secret, server-side only, never `NEXT_PUBLIC`.
- `NEXT_PUBLIC_SITE_URL`: the app base URL, used for auth redirects and the
  ticket links sent to Learners Hub.
- `KB_SUBMISSIONS_URL`, `KB_API_KEY`, `KB_WEBHOOK_SECRET`: the Learners Hub
  knowledge base handoff (`docs/kb-integration.md`). Optional; the app runs
  without them and promote falls back to flagging locally.

In production these live in the Vercel project settings, not in a committed
file.

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

## Database

Migrations, RLS policies, and the seed script live in `supabase/`. There is one
hosted database, provisioned through the Supabase integration on Vercel, shared
by development and production. No Docker and no local stack.

```
npm run db:push      # apply migrations to the database
npm run db:seed      # load the demo cohort and tickets
npm run db:verify    # check the RLS rules against the live database
npm run db:invite    # add an email to the sign-up allowlist (bootstrap)
```

Database types live in `types/database.ts` and are kept in sync with the
migrations by hand; the file explains how to regenerate them. The full data
story (schema, security model, auth flow) is in `DOCUMENTATION.md`.

## Deploy

Vercel builds every pull request as a preview and `main` as production. This
app is the repository root, so the Vercel project root directory is the default
(no subfolder). Branch protection on `main` requires green CI and one approving
review.

## Contributing for the first time

Welcome! Work through Getting started above first, and ask the project owner
for one more thing: an invitation to the app itself plus demo sign-in
credentials, so you can use the screens you are changing. Then:

1. Choose an issue labeled **easy fix**. Leave a comment on the issue so others
   know you are working on it.

2. Create a branch from the latest `main`.

   ```bash
   git checkout main
   git pull
   git checkout -b fix/issue-13-placeholders
   ```

3. Make your change, then run the quality checks. All of them must pass; the
   pre-commit hook also insists.

   ```bash
   npm run lint
   npm run typecheck
   npm run test
   npm run build
   ```

4. Open a pull request that references the issue number, for example
   `Closes #13` (no space after the `#`, so GitHub links and closes the issue
   automatically). One pull request per issue. Never push directly to `main`.

5. Read `CONTRIBUTING.md` and `CLAUDE.md` before contributing. The two rules
   that surprise people:
   - Design tokens only. No raw hex colors and no one-off pixel sizes.
   - No em dashes anywhere. The commit hook and CI enforce this.

## Documentation

- `CLAUDE.md`: locked stack, commands, definition of done, guardrails.
- `CONTRIBUTING.md`: branching, commits, PR rules, how to add a feature.
- `design-guidelines.md`: the living design contract (tokens, components,
  rules).
- `DOCUMENTATION.md`: how the app is built and the change log.
- [Deskolas Design System.pdf](https://github.com/user-attachments/files/29555947/Deskolas.Design.System.pdf):
  the visual design reference.

The design intent and data model live in the handoff bundle one level up
(`Design_Brief.md`, `Overview.md`, `COMPONENT_INVENTORY.md`, and `screens/`).
