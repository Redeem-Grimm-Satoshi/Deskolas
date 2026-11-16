import type { Role } from "@/lib/tickets";

// The guided tour is a registry, not a script. Each step points at a
// `data-tour` anchor somewhere in the UI; the overlay finds the anchor at run
// time, navigates to `route` if it is not on the current page, and skips the
// step when the anchor is not rendered (hidden on mobile, gated by role, or an
// empty list). To add a feature to the tour, add a step here and put the
// matching `data-tour` attribute on the element. Returning users are offered
// only the steps they have not seen, so new steps surface on their own.
export type TourStep = {
  /** Stable id; stored per user to remember what has been seen. */
  id: string;
  /** Value of the `data-tour` attribute on the element to spotlight. */
  target: string;
  title: string;
  body: string;
  /** Page the anchor lives on. Omit when it is in the shell (sidebar, top bar). */
  route?: string;
  /** Roles who get this step. Omit for everyone. */
  roles?: readonly Role[];
};

export const TOUR_STEPS: readonly TourStep[] = [
  {
    id: "queue",
    target: "nav-tickets",
    route: "/tickets",
    title: "The queue",
    body: "Every open problem in the cohort lands here. Anyone can read any ticket, so you always know what classmates are stuck on and what you could pick up.",
  },
  {
    id: "new-ticket",
    target: "new-ticket",
    route: "/tickets",
    title: "Stuck? Deskolas it.",
    body: "Open a ticket with a short title, what happened, and what you have already tried. The more specific, the faster someone can pick it up.",
  },
  {
    id: "filters",
    target: "queue-filters",
    route: "/tickets",
    title: "Narrow the queue",
    body: "Filter by status, category, and priority to find the tickets that matter right now. Clear them to see the whole queue again.",
  },
  {
    id: "ticket-card",
    target: "ticket-card",
    route: "/tickets",
    title: "Read a ticket at a glance",
    body: "The colored spine is the status and the stub is the reference. Open a ticket to claim it, add a comment, and resolve it once the fix is confirmed.",
  },
  {
    id: "search",
    target: "search",
    route: "/tickets",
    title: "Find it fast",
    body: "Search by title. The queue narrows as you type.",
  },
  {
    id: "my-tickets",
    target: "nav-my-tickets",
    title: "Your corner",
    body: "Tickets you opened and tickets you claimed, in one place, so you can follow what is yours.",
  },
  {
    id: "dashboard",
    target: "nav-dashboard",
    roles: ["admin"],
    title: "The cohort at a glance",
    body: "Open, in progress, and resolved counts, what needs attention, recent activity, and where the problems cluster.",
  },
  {
    id: "people",
    target: "nav-people",
    roles: ["admin"],
    title: "Who gets in",
    body: "Accounts are invite only. Add a cohort member by email here and grant admin when someone needs oversight.",
  },
  {
    id: "knowledge-base",
    target: "nav-kb",
    title: "The best fixes live on",
    body: "A resolved ticket can be promoted to the Learners Hub knowledge base, so the next person finds the answer before they need to ask.",
  },
  {
    id: "notifications",
    target: "notifications",
    title: "Stay in the loop",
    body: "Claims, comments, and status changes on your tickets show up here as they happen.",
  },
  {
    id: "theme",
    target: "theme",
    title: "Dark or light",
    body: "Switch themes whenever you like. Deskolas remembers your choice.",
  },
  {
    id: "account",
    target: "user-menu",
    title: "You",
    body: "Your name, profile photo, and sign out live in this menu. Replay this tour any time from the sidebar.",
  },
];

export type TourRecord = {
  seen: string[];
  /** Set when the welcome prompt was dismissed without taking the tour. */
  skippedAt?: string;
};

export function stepsForRole(
  role: Role,
  steps: readonly TourStep[] = TOUR_STEPS,
) {
  return steps.filter((step) => !step.roles || step.roles.includes(role));
}

export function unseenSteps(
  steps: readonly TourStep[],
  record: TourRecord | null,
) {
  if (!record) return [...steps];
  const seen = new Set(record.seen);
  return steps.filter((step) => !seen.has(step.id));
}

export function markSeen(
  record: TourRecord | null,
  ids: readonly string[],
  extra: Partial<TourRecord> = {},
): TourRecord {
  const seen = new Set([...(record?.seen ?? []), ...ids]);
  return { ...record, ...extra, seen: [...seen] };
}

const storageKey = (userId: string) => `deskolas:tour:${userId}`;

// Per user and per browser. A new device shows the welcome prompt again,
// which is fine: it is one click to skip. Storage can be unavailable (private
// mode, blocked), so every access is guarded.
export function readTourRaw(userId: string): string | null {
  try {
    return window.localStorage.getItem(storageKey(userId));
  } catch {
    return null;
  }
}

export function parseTourRecord(raw: string | null): TourRecord | null {
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      Array.isArray((parsed as TourRecord).seen)
    ) {
      return parsed as TourRecord;
    }
    return null;
  } catch {
    return null;
  }
}

export function readTourRecord(userId: string): TourRecord | null {
  return parseTourRecord(readTourRaw(userId));
}

export function writeTourRecord(userId: string, record: TourRecord) {
  try {
    window.localStorage.setItem(storageKey(userId), JSON.stringify(record));
  } catch {
    // Nothing to do: the tour still runs, it just will not be remembered.
  }
}
