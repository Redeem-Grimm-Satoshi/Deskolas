# Deskolas design guidelines

The living design contract for Deskolas, the cohort help desk. Every UI change references this document. It encodes the design system once so the interface stays consistent as multiple people build on it.

Source of truth for intent and rationale: `Design_Brief.md`. This file is the engineering-facing distillation: exact token names, values, component rules, and the do/don't list. When the two disagree, the brief wins and this file gets corrected.

Dark is the default theme. Light ships alongside it. Every value below has a dark and a light form where the surface matters.

---

## 1 / Principles (the tie-breakers)

When a design decision is unclear, these settle it in order:

1. Neutral first; accent earns its place. The interface is about 90 percent greyscale. Blue appears only where it carries meaning.
2. Hierarchy comes from type and space, not color and chrome.
3. Flat and honest. No gradients, no glows, no colored shadows.
4. One system, no one-offs. Every size, space, and radius comes from a defined scale.
5. Restraint is the default. One primary action per view. One separation method at a time.
6. The details are the work. Optical alignment, tabular numerals, real empty states, sentence-case copy.

The bar: someone fluent in product design should find nothing to remove.

---

## 2 / Color tokens

No component ships a raw hex or a one-off. If a value is not a token, it does not ship.

### Accent (blue): the only chromatic family in the UI

| Token                    | Hex                    | Use                                                         |
| ------------------------ | ---------------------- | ----------------------------------------------------------- |
| `accent`                 | `#0EA5E9`              | logo, primary button fill, active states, In progress spine |
| `accent-hover`           | `#0284C7`              | hover on primary                                            |
| `accent-pressed`         | `#0369A1`              | pressed / active on primary                                 |
| `accent-text` (light bg) | `#0369A1`              | links / accent text on light, passes AA on white            |
| `accent-text` (dark bg)  | `#38BDF8`              | links / accent text on dark                                 |
| `accent-tint` (light)    | `#F0F9FF`              | selected row, subtle accent fill on light                   |
| `accent-tint` (dark)     | `rgba(14,165,233,.12)` | selected row / active nav on dark                           |

The accent budget: blue is allowed only on the primary action, the active nav item, links, focus rings, text selection, and the ticket status spine. If a second blue thing wants to appear on a screen, one of them is wrong.

### Neutrals (zinc): the workhorse

| Role            | Token        | Dark (default) | Light     |
| --------------- | ------------ | -------------- | --------- |
| Page            | `bg`         | `#09090B`      | `#FAFAFA` |
| Surface / card  | `surface`    | `#18181B`      | `#FFFFFF` |
| Hairline border | `border`     | `#27272A`      | `#E4E4E7` |
| Text primary    | `text`       | `#F4F4F5`      | `#18181B` |
| Text secondary  | `text-2`     | `#A1A1AA`      | `#52525B` |
| Text muted      | `text-muted` | `#71717A`      | `#A1A1AA` |

Two surfaces, one hairline. Resist inventing a third surface step.

### Status: spine color plus text label, never color alone

| Status      | Spine             | Pill (light)                  | Pill (dark)                      |
| ----------- | ----------------- | ----------------------------- | -------------------------------- |
| New         | `#F59E0B` amber   | bg `#FFFBEB` · text `#B45309` | bg `amber/15` · text `#FBBF24`   |
| In progress | `#0EA5E9` accent  | bg `#F0F9FF` · text `#0369A1` | bg `accent/15` · text `#38BDF8`  |
| Resolved    | `#10B981` emerald | bg `#ECFDF5` · text `#047857` | bg `emerald/15` · text `#34D399` |
| Closed      | `#A1A1AA` zinc    | bg `#F4F4F5` · text `#52525B` | bg `zinc/15` · text `#A1A1AA`    |

Status is always communicated by spine color and a text label together. Color is never the sole signal (accessibility).

### Priority: a whisper, not a shout

A small text label or dot, never a colored block.

| Priority | Color                                    | Treatment                               |
| -------- | ---------------------------------------- | --------------------------------------- |
| Low      | `text-muted` neutral                     | dot + label in muted neutral            |
| Medium   | `#D97706` amber-600                      | small dot + label                       |
| High     | `#E11D48` rose-600 (dark text `#FB7185`) | small dot + label; may nudge sort order |

---

## 3 / Typography

Inter at 400 / 500 / 600 only. JetBrains Mono at 400 / 500 for IDs, timestamps, and codes, always with tabular figures so numbers align.

| Role        | Size / line-height | Tracking | Weight | Use                              |
| ----------- | ------------------ | -------- | ------ | -------------------------------- |
| Display     | 30 / 36            | −0.02em  | 600    | hero only, rare                  |
| Title       | 20 / 28            | −0.01em  | 600    | page titles                      |
| Heading     | 16 / 24            | −0.005em | 600    | section and card titles          |
| Body        | 14 / 20            | 0        | 400    | default text                     |
| Body-medium | 14 / 20            | 0        | 500    | labels, emphasis                 |
| Small       | 13 / 18            | 0        | 400    | secondary text                   |
| Caption     | 12 / 16            | 0        | 400    | meta, timestamps                 |
| Overline    | 11 / 14            | +0.06em  | 500    | UPPERCASE section labels, sparse |

Rules: tighten tracking as type grows, open it on tiny uppercase labels. Numerals are tabular wherever they align. Sentence case everywhere except the rare overline. Never below 12px for reading content (11px is reserved for the uppercase overline).

---

## 4 / Space, radius, elevation

Spacing, 4px base. Use only: `4 8 12 16 24 32 48 64`. 8px rhythm inside components, 24 to 32px between sections. Reading flows left, not center-stacked.

Radius, a small deliberate set. Nested radius steps down (a 12px card containing an 8px control reads concentric).

| Token            | Value  | Use                                    |
| ---------------- | ------ | -------------------------------------- |
| `radius-control` | 8px    | buttons, inputs, menu items            |
| `radius-card`    | 12px   | cards, panels, dialogs                 |
| `radius-full`    | 9999px | pills, avatars, dots, the status spine |

Elevation, flat by default. Separate surfaces with a hairline and a surface step, not a shadow.

- Borders: 1px low-contrast neutral. One separation method at a time (whitespace, or a hairline, or a surface change, never all three). On hover, a card's border gains contrast slightly; it does not glow.
- Shadows: only for genuinely floating layers (dropdowns, popovers, modals). Soft and neutral. Dark `0 8px 24px rgba(0,0,0,.40)`, light `0 8px 24px rgba(0,0,0,.10)`. Never colored. At most two floating layers on screen; a third should be a dialog.

---

## 5 / Motion

Motion confirms a change, it does not perform.

- Micro-interactions (hover, press, toggles): 120 to 160ms, ease-out `cubic-bezier(0.2, 0, 0, 1)`.
- Panels, menus, modals: 200 to 240ms.
- Animate transform and opacity only. No bounce, no spring.
- Always wrap in `prefers-reduced-motion: no-preference`.

---

## 6 / Iconography

lucide-react, uniform 1.5px stroke, 16 to 20px, optically centered. Icons carry meaning, not decoration. One icon per concept, used consistently. Never mix in a second icon set.

App icon set in use: `Ticket` (brand mark, nav), `LifeBuoy`, `Inbox` / `Files` (my tickets), `BookOpen` (Knowledge Base, with an external-link affordance), `LayoutGrid` (dashboard), `Users` (people), `Search`, `Plus`, `ChevronDown`, `ChevronLeft`, `Bell`, `Lock`, `RotateCcw` (reopen), `LogOut`.

---

## 7 / The signature: perforated stub

Deskolas's one distinctive device. A paper ticket has a tear-off stub along a perforated edge, so every ticket card splits into a mono-ID stub and a body, divided by a dashed perforation, with a slim status spine down the left edge. Glance down a queue and you read the whole state from spine colors alone.

It is structural, not chromatic. It lives in layout and borders, so it can never fight the palette.

```jsx
<div className="bg-surface border-border flex items-stretch gap-3 rounded-[12px] border p-4">
  {/* status spine: an inset bar, never a border on the card */}
  <span className="bg-st-new w-1 shrink-0 rounded-full" aria-hidden />
  {/* stub: mono ID, divided by the perforation */}
  <div className="border-border flex items-center border-r border-dashed pr-3.5">
    <span className="text-text-muted font-mono text-[12px] tabular-nums">
      PS-0002
    </span>
  </div>
  {/* body: title, meta, status pill */}
  <div className="min-w-0 flex-1"> ... </div>
</div>
```

Discipline:

- The spine is an inset element; the perforation is an inner divider. Never put a colored or dashed border on the rounded card itself (single-sided borders on rounded corners read as broken).
- A signature, not a texture. Use it on ticket cards plus the occasional dashed section divider. Nowhere else.
- Never on the logo. The motif is geometry only, never expressed by changing color or type or adding a gradient.
- Keep the text status label beside the spine.

---

## 8 / Component catalog

Build the library to match the Phase 2 style sheet (see `Deskolas Design System.dc.html`). Every component below has a dark and a light form and ships with all its states. Build on Radix primitives via shadcn/ui, restyled to these tokens, never shipped with default shadcn looks.

| Component               | States to implement                      | Notes                                                                                         |
| ----------------------- | ---------------------------------------- | --------------------------------------------------------------------------------------------- |
| Button / primary        | default, hover, pressed, focus, disabled | `accent` fill, white label, `radius-control`. One primary per view.                           |
| Button / secondary      | default, hover, focus, disabled          | surface fill, hairline border.                                                                |
| Button / ghost          | default, hover, focus, disabled          | transparent, neutral label, fills on hover.                                                   |
| Input / text            | default, focus, error, disabled          | focus is accent border + 3px accent tint ring. Error is rose border + one-line message below. |
| Select                  | default, open                            | chevron-down affordance; menu is a floating layer.                                            |
| Textarea                | default, focus                           | same border language as input.                                                                |
| Search field            | default, with-icon                       | leading `Search` icon, muted placeholder.                                                     |
| Status pill             | New, In progress, Resolved, Closed       | tint bg + text per the status table. Pairs with spine.                                        |
| Priority label          | Low, Medium, High                        | dot + label, never a block.                                                                   |
| Ticket card (signature) | each status, hover                       | perforated stub. Spine color carries queue scan.                                              |
| Sidebar nav item        | default, active                          | active is the one accent moment in the chrome (`accent-tint` bg + accent text).               |
| Top bar                 | default                                  | title, search, primary action, avatar. Condenses on mobile.                                   |
| Dialog / modal          | open                                     | neutral soft shadow, one primary action. Full-screen sheet on mobile.                         |
| Toast                   | success                                  | plain copy, no "successfully", no exclamation. Auto-dismiss.                                  |
| Empty state             | per screen                               | inviting copy, single primary action.                                                         |
| Toggle                  | on, off                                  | for settings; accent when on.                                                                 |
| Avatar                  | initials, image                          | `radius-full`, neutral surface for initials.                                                  |
| Notification item       | unread, read                             | unread dot in accent.                                                                         |

### Adding a new component on-system

1. Compose from existing tokens and Radix primitives. No raw hex, no one-off size or radius.
2. Match the state set of its nearest sibling (default / hover / focus / disabled at minimum; error and loading where it takes input or triggers work).
3. Honor the accent budget: a new component does not introduce a second accent moment to a view.
4. One separation method. Hairline or surface step or whitespace, not stacked.
5. Verify against this document before review. UI pull requests include a screenshot and a design-faithfulness check.

---

## 9 / Voice and microcopy

- Sentence case everywhere. No terminal punctuation on buttons or labels.
- Verb-first buttons: "Open a ticket", "Assign to me", "Resolve". Not "Submit" or "OK".
- No "successfully", no exclamation. The result is the confirmation: "Ticket PS-0007 submitted".
- Errors say what happened then what to do, in one line, no "Error:" prefix: "That email is not on the cohort list. Use your Per Scholas address."
- Empty states invite, not apologize: "Nothing open right now. Nice." / "Open your first ticket to get started."
- Save "Stuck? Deskolas it." for one or two personality moments (onboarding, an empty state). Everywhere else, plain.

---

## 10 / The "not vibe-coded" checklist

| Tell to avoid                                          | What we do instead                                                           |
| ------------------------------------------------------ | ---------------------------------------------------------------------------- |
| Gradient logo / text / buttons                         | Flat, confident fills                                                        |
| Glows and colored shadows                              | Neutral hairlines plus surface steps; soft neutral shadow only when floating |
| Accent color on everything                             | Neutral first; one accent moment per view                                    |
| Arbitrary one-off values (`text-[13px]`, random radii) | Defined type / space / radius scales only                                    |
| Four or five font weights                              | Three: 400 / 500 / 600                                                       |
| Border plus shadow plus fill for one separation        | One separation method at a time                                              |
| Centered feature-card grids                            | Real hierarchy, left-aligned reading flow                                    |
| Decorative icons, mixed icon sets                      | One library, 1.5px stroke, meaning only                                      |
| "Submitted successfully!" copy                         | Plain, verb-first, sentence-case                                             |
| Bouncy or long animations                              | 120 to 240ms, ease-out, transform and opacity                                |

---

## 11 / Screen reference

Faithful frames for every screen and state live in `readme/` (key screens) and the design components themselves. Organized by route group in `screens/` for engineering:

- `(auth)`: sign in (default / error / loading), create account, access denied, forgot password, check email, set new password.
- `(app)/dashboard`: admin landing with metric tiles, needs-attention, recent activity, tickets by category.
- `(app)/tickets`: admin queue (with empty state), ticket detail (admin full controls, learner read-only, resolved + reopen).
- `(app)/my-tickets`: learner landing with empty state.
- New ticket: modal over queue, standalone, mobile sheet.
- Settings: profile, notifications.
- Admin people and roles: invite, member table, pending invite.
- System: 404, in-app access denied. Notifications panel. Promote to Knowledge Base confirm.

Each frame is desktop-first at 1440 wide with mobile at 390. Verify each screen against its frame rather than approximating.
