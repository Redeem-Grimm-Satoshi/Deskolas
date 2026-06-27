# CLAUDE.md

Project rules for every contributor, human or agent. Read this before writing
code. It is the contract that keeps Deskolas consistent as a team builds on it.

Deskolas is the cohort help desk: a learner ticketing system for the Per Scholas
AI-Enabled Healthcare IT cohort. Product context is in the handoff bundle
(`Overview.md`, `Design_Brief.md`) one level up from this app folder.

## Locked tech stack

Do not add a dependency or swap a tool without justifying it in this section.

- Framework: Next.js (App Router) with TypeScript in strict mode. Server
  components by default; client components only where interactivity needs them.
  Server logic lives in route handlers and server actions, not a separate server.
- Styling: Tailwind CSS themed to the design tokens, Radix UI primitives via
  shadcn/ui restyled to our tokens, lucide-react for icons at a 1.5px stroke.
- Backend, data, auth: Supabase (Postgres, Auth, Storage, Row-Level Security)
  through `@supabase/ssr`. DB types are generated from the schema, never written
  by hand.
- Forms and validation: react-hook-form with zod. Validate on the client and
  re-validate on the server. Never trust the client.
- Client data: TanStack Query, only where a screen genuinely needs client
  fetching. Prefer server components and server actions first.
- Testing: Vitest with React Testing Library, Playwright for end to end, axe for
  accessibility.
- Quality tooling: ESLint (typescript-eslint, strict), Prettier, Husky with
  lint-staged, Conventional Commits.
- Package manager: npm.

### Stack notes (justified deviations)

- Tailwind v4 with CSS-first config. Tokens live in `app/globals.css` under
  `@theme`, not a `tailwind.config.ts`. This is the current Tailwind, and a
  token-driven design maps cleanly onto CSS variables.
- This is Next.js 16, which has breaking changes from older majors. When an API
  surprises you, check the bundled guide in `node_modules/next/dist/docs/`
  before assuming.

## Commands

All of these must pass before any work is considered done. No exceptions.

```
npm run dev         # local dev
npm run build       # production build must succeed
npm run lint        # eslint, zero warnings
npm run typecheck   # tsc --noEmit, zero errors
npm run test        # vitest unit and component
npm run test:e2e    # playwright critical flows
npm run format      # prettier write
```

## Definition of done

A change is done only when all of the following hold:

- Design-faithful: matches the token set in `design-guidelines.md` and the
  matching frame in the screen pack. No raw hex, no one-off size or radius.
- Typed: no `any`, no unused code. `npm run typecheck` is clean.
- Green: lint, typecheck, build, unit tests, and the relevant e2e all pass.
- Accessible: semantic HTML, labelled inputs, visible focus, keyboard reachable.
- Responsive: desktop-first, verified down to the 390px mobile frame.
- Safe: Row-Level Security respected, every mutation validated on the server.
- Real states: loading, empty, and error are designed and handled, not stubbed.

## Guardrails

- Server components by default. Reach for `"use client"` only when an
  interaction needs it.
- Never expose the service-role key to the browser. The anon key is the only key
  in client code. The service-role key is server-side only, read from env.
- Validate every mutation on the server with a zod schema, even when the client
  already validated.
- Tokens only. If a value is not in `design-guidelines.md`, it does not ship.
- Comments explain why, not what. Most functions need none. No dead code, no
  commented-out blocks, no leftover console logs (warn and error are allowed).
- No fingerprints. No em dashes anywhere (code, comments, docs, commits, PRs,
  UI copy). No AI attribution of any kind in commits, PRs, or files. Every
  change reads as written by the engineer who owns it. CI enforces both with a
  grep guard (`scripts/check-fingerprints.sh`), and so does the pre-commit hook.

## Where things live

- `app/(auth)` unauthenticated screens, `app/(app)` the authenticated shell.
- `components/ui` token-themed primitives, `components/tickets` feature pieces.
- `lib/supabase` server, client, and middleware Supabase helpers.
- `lib/validations` zod schemas shared by client and server.
- `supabase` migrations, RLS policies, and the seed script.
- `types` generated DB types and shared types.
