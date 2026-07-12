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

## Contributing for the first time

Welcome! If this is your first contribution, follow these steps to get your local development environment ready.

1. Clone the repository and install dependencies. Make sure you have Node.js 20 or newer installed.

   ```bash
   git clone <repository-url>
   cd <repository-folder>
   npm install
   ```

2. Ask the project owner for two things before running the app:
   - The `.env.local` file. The app requires Supabase keys that are intentionally not included in the repository.
   - An invitation to the application and demo sign in credentials.

3. Start the development server.

   ```bash
   npm run dev
   ```

   Then open <http://localhost:3000> in your browser.

4. Visit <http://localhost:3000/components> to explore the design system before making changes. It contains the building blocks used throughout the application.

5. Choose an issue labeled **easy fix**. Leave a comment on the issue so others know you are working on it. Then create a branch from `main`.

   ```bash
   git checkout main
   git pull
   git checkout -b fix/issue-13-placeholders
   ```

6. Before opening a pull request, run the quality checks.

   ```bash
   npm run lint
   npm run typecheck
   npm run test
   npm run build
   ```

   All commands must pass. The pre commit hook also requires them to pass.

7. Open a pull request that references the issue number. For example:

   ```
   Closes #13
   ```

   Create one pull request per issue. Never push directly to `main`.

8. Read `CONTRIBUTING.md` and `CLAUDE.md` before contributing. Pay special attention to these project rules:
   - Use design tokens only. Do not use raw hex color values or one off pixel sizes.
   - Do not use em dashes. The commit hook enforces this.
   
## Documentation

- `CLAUDE.md`: locked stack, commands, definition of done, guardrails.
- `CONTRIBUTING.md`: branching, commits, PR rules, how to add a feature on-system.
- `design-guidelines.md`: the living design contract (tokens, components, rules).

The design intent and data model live in the handoff bundle one level up
(`Design_Brief.md`, `Overview.md`, `COMPONENT_INVENTORY.md`, and `screens/`).
