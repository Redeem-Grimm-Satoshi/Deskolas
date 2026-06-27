# Contributing to Deskolas

Welcome. Deskolas is built by a rotating set of cohort engineers, so the rules
below exist to keep the codebase coherent as it grows. Read `CLAUDE.md` for the
locked stack and the definition of done. This file covers how we work together.

## Local setup

1. Use Node 20 or newer.
2. `npm install` from this folder (`deskolas/`). The `prepare` script installs
   the Husky git hooks automatically.
3. Copy `.env.example` to `.env.local` and fill in the values. The Supabase
   project keys come from the project dashboard; an admin can share them.
4. `npm run dev` and open http://localhost:3000.

To run the database locally instead of against the cloud project, see the
Supabase section of the `README.md`.

## Branching

- `main` is protected. No direct pushes. It always ships green and deployable.
- Branch off `main` with a short-lived feature branch named for the work, for
  example `feat/ticket-detail` or `fix/queue-filter-reset`.
- Keep branches small and rebase or merge `main` in often.

## Commits

- Conventional Commits: `feat:`, `fix:`, `chore:`, `refactor:`, `test:`,
  `docs:`, `build:`, `ci:`. One logical change per commit.
- Write commit messages as plain prose in the imperative mood. State what
  changed and why when the why is not obvious.
- No em dashes. No AI attribution of any kind: no co-authorship trailers naming
  a model or vendor, no tool-generated footers, no note that a model helped.
  Every commit reads as the engineer who owns the change. The `commit-msg` hook
  and CI both reject these.

## Pull requests

- Keep PRs small and focused. A reviewer should hold the whole change in their
  head.
- Fill in the PR template and link the issue it closes.
- All CI checks must be green: lint, typecheck, build, unit, e2e, and the
  fingerprint guard.
- At least one approving review before merge.
- For any UI change, attach before and after screenshots and confirm the design
  faithfulness checklist (matches the token set and the relevant screen frame).

## Definition of done

The shared bar lives in `CLAUDE.md`. In short: design-faithful, typed, green,
accessible, responsive, RLS respected, and real loading, empty, and error
states. A change that misses any of these is not done.

## Adding a feature without drifting from the design

The design system is the product. Before adding UI:

1. Read `design-guidelines.md`. Compose from existing tokens and the Radix
   primitives already in `components/ui`. No raw hex, no one-off size or radius.
2. Match the state set of the nearest sibling component (default, hover, focus,
   disabled at minimum; error and loading where the component takes input or
   triggers work).
3. Honor the accent budget: one accent moment per view. A new component does not
   add a second blue thing to a screen.
4. Use one separation method at a time: a hairline, or a surface step, or
   whitespace, never all three.
5. Verify against `design-guidelines.md` and the matching screen frame before
   you open the PR.
