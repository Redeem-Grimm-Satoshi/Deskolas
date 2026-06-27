// Stand-in data for the UI build. Shapes mirror the planned Supabase schema so
// the screens swap onto real queries in Phase 2 with minimal change. Time is
// stored as the exact label each frame shows rather than a timestamp, so the
// preview reads true; a real formatter replaces these when timestamps land.

import type {
  TicketCategory,
  TicketPriority,
  TicketStatus,
} from "@/lib/tickets";

export type Role = "admin" | "learner";

export type Profile = {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  joinedLabel?: string;
};

export type Ticket = {
  id: string;
  title: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  submittedById: string;
  assignedToId: string | null;
  resolutionNotes: string | null;
  isCandidateArticle: boolean;
  kbArticleUrl: string | null;
  createdLabel: string;
  updatedLabel: string;
};

export type Comment = {
  id: string;
  ticketId: string;
  authorId: string;
  body: string;
  timeLabel: string;
};

// A single entry in a ticket's activity timeline.
export type Activity = {
  id: string;
  ticketId: string;
  actorId: string;
  action: string;
  timeLabel: string;
};

export type Notification = {
  id: string;
  read: boolean;
  ticketId: string;
  body: string;
  timeLabel: string;
};

export const PROFILES: Record<string, Profile> = {
  andre: {
    id: "andre",
    fullName: "Andre T.",
    email: "andre@cohort.dev",
    role: "admin",
    joinedLabel: "Jan 6",
  },
  maria: {
    id: "maria",
    fullName: "Maria L.",
    email: "maria@cohort.dev",
    role: "admin",
    joinedLabel: "Jan 6",
  },
  priya: {
    id: "priya",
    fullName: "Priya S.",
    email: "priya@cohort.dev",
    role: "learner",
    joinedLabel: "Jan 8",
  },
  redeem: {
    id: "redeem",
    fullName: "Redeem G.",
    email: "redeem@cohort.dev",
    role: "learner",
    joinedLabel: "Jan 8",
  },
  jose: {
    id: "jose",
    fullName: "Jose R.",
    email: "jose@cohort.dev",
    role: "learner",
    joinedLabel: "Jan 9",
  },
};

export const PENDING_INVITES = [
  { email: "dana@cohort.dev", role: "Learner", invitedLabel: "Invited 2d ago" },
];

export const TICKETS: Ticket[] = [
  {
    id: "PS-0001",
    title: "Can't connect to the lab VM over RDP",
    description:
      "Remote Desktop times out when I try to reach the lab VM from home. It worked yesterday. The host resolves but the connection never completes, even after a reboot.",
    category: "Network and Access",
    priority: "high",
    status: "new",
    submittedById: "priya",
    assignedToId: null,
    resolutionNotes: null,
    isCandidateArticle: false,
    kbArticleUrl: null,
    createdLabel: "Today, 08:12",
    updatedLabel: "2h ago",
  },
  {
    id: "PS-0002",
    title: "git push rejected, SSH key auth failing",
    description:
      "Every push returns Permission denied (publickey). My key is in the agent and added on GitHub, but the cohort repo still refuses it.",
    category: "Git and GitHub",
    priority: "high",
    status: "new",
    submittedById: "redeem",
    assignedToId: null,
    resolutionNotes: null,
    isCandidateArticle: false,
    kbArticleUrl: null,
    createdLabel: "Today, 07:55",
    updatedLabel: "8h ago",
  },
  {
    id: "PS-0003",
    title: "VS Code can't find my Python interpreter",
    description:
      'After the last update, VS Code shows "Select interpreter" and none of my environments appear. Running python3 in the terminal works fine and points to 3.11, but the editor still can\'t run or debug my files. I tried reloading the window and reinstalling the Python extension.',
    category: "Software and IDE",
    priority: "medium",
    status: "in_progress",
    submittedById: "priya",
    assignedToId: "andre",
    resolutionNotes: null,
    isCandidateArticle: false,
    kbArticleUrl: null,
    createdLabel: "Today, 09:41",
    updatedLabel: "28m ago",
  },
  {
    id: "PS-0004",
    title: "Locked out of the LMS after too many login attempts",
    description:
      "The LMS locked my account after a few wrong passwords. The reset email never arrives and I have an assignment due tonight.",
    category: "Accounts and LMS",
    priority: "low",
    status: "in_progress",
    submittedById: "jose",
    assignedToId: "priya",
    resolutionNotes: null,
    isCandidateArticle: false,
    kbArticleUrl: null,
    createdLabel: "Today, 06:30",
    updatedLabel: "3h ago",
  },
  {
    id: "PS-0005",
    title: "Zoom mic not picking up audio in class",
    description:
      "My mic shows no input in Zoom during class. It works in other apps. Classmates can't hear me on calls.",
    category: "Hardware and AV",
    priority: "low",
    status: "resolved",
    submittedById: "jose",
    assignedToId: "andre",
    resolutionNotes:
      'Switched the input device to the USB headset in Zoom\'s audio settings and turned off "exclusive mode" in Windows sound properties. Mic levels confirmed in the Zoom test call.',
    isCandidateArticle: false,
    kbArticleUrl: null,
    createdLabel: "Today, 05:10",
    updatedLabel: "3h ago",
  },
  {
    id: "PS-0006",
    title: "Campus Wi-Fi keeps dropping every few minutes",
    description:
      "The campus network drops every few minutes on my laptop. Reconnecting works but it happens constantly during labs.",
    category: "Network and Access",
    priority: "medium",
    status: "closed",
    submittedById: "redeem",
    assignedToId: "maria",
    resolutionNotes:
      "Forgot the saved network and rejoined on the 5GHz band, and updated the Wi-Fi driver. Stable across a full lab session since.",
    isCandidateArticle: true,
    kbArticleUrl: "https://learners-hub.bolt.host/wifi-drops",
    createdLabel: "Yesterday, 14:20",
    updatedLabel: "1d ago",
  },
  {
    id: "PS-0007",
    title: "Docker won't start on the lab laptop",
    description:
      "Docker Desktop hangs on starting and never finishes. Restarting the laptop did not help. I need it for the container lab.",
    category: "Software and IDE",
    priority: "medium",
    status: "new",
    submittedById: "redeem",
    assignedToId: null,
    resolutionNotes: null,
    isCandidateArticle: false,
    kbArticleUrl: null,
    createdLabel: "Today, 07:40",
    updatedLabel: "22h ago",
  },
  {
    id: "PS-0008",
    title: "Two-factor codes never arrive for the LMS",
    description:
      "The LMS texts a 2FA code on sign-in but it never reaches my phone, so I can't get in. Other texts arrive fine.",
    category: "Accounts and LMS",
    priority: "medium",
    status: "in_progress",
    submittedById: "redeem",
    assignedToId: "maria",
    resolutionNotes: null,
    isCandidateArticle: false,
    kbArticleUrl: null,
    createdLabel: "Today, 09:10",
    updatedLabel: "25m ago",
  },
  {
    id: "PS-0009",
    title: "Headset mic not detected in the testing room",
    description:
      "The testing room PC does not detect my headset mic at all. The headphones work, but the mic is missing from the input list.",
    category: "Hardware and AV",
    priority: "low",
    status: "new",
    submittedById: "redeem",
    assignedToId: null,
    resolutionNotes: null,
    isCandidateArticle: false,
    kbArticleUrl: null,
    createdLabel: "Today, 07:20",
    updatedLabel: "2h ago",
  },
  {
    id: "PS-0011",
    title: "Merge conflict I couldn't resolve on the group project",
    description:
      "Pulling the latest left me with conflicts I could not resolve cleanly, and now my branch won't build. I do not want to lose my work.",
    category: "Git and GitHub",
    priority: "medium",
    status: "resolved",
    submittedById: "redeem",
    assignedToId: "andre",
    resolutionNotes:
      "Walked through the conflicting files, kept both changes where they belonged, and ran the test suite to confirm the build. Pushed a clean merge commit.",
    isCandidateArticle: false,
    kbArticleUrl: null,
    createdLabel: "Yesterday, 16:02",
    updatedLabel: "1d ago",
  },
];

export const COMMENTS: Comment[] = [
  {
    id: "c1",
    ticketId: "PS-0003",
    authorId: "andre",
    body: 'Open the command palette and run "Python: Select Interpreter", then pick the 3.11 path. If it\'s missing, what does which python3 return?',
    timeLabel: "40m ago",
  },
  {
    id: "c2",
    ticketId: "PS-0003",
    authorId: "priya",
    body: "It returns /usr/bin/python3 but the editor still shows 2.7. Trying the palette now.",
    timeLabel: "30m ago",
  },
];

export const ACTIVITY: Activity[] = [
  {
    id: "a1",
    ticketId: "PS-0003",
    actorId: "priya",
    action: "opened this ticket",
    timeLabel: "1h ago",
  },
  {
    id: "a2",
    ticketId: "PS-0003",
    actorId: "andre",
    action: "claimed it and set In progress",
    timeLabel: "58m ago",
  },
  {
    id: "a3",
    ticketId: "PS-0005",
    actorId: "andre",
    action: "set Resolved and added notes",
    timeLabel: "3h ago",
  },
  {
    id: "a4",
    ticketId: "PS-0005",
    actorId: "jose",
    action: "opened this ticket",
    timeLabel: "5h ago",
  },
];

export const NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    read: false,
    ticketId: "PS-0003",
    body: "Andre T. assigned PS-0003 to you",
    timeLabel: "2m ago",
  },
  {
    id: "n2",
    read: false,
    ticketId: "PS-0008",
    body: "Your ticket PS-0008 moved to In progress",
    timeLabel: "25m ago",
  },
  {
    id: "n3",
    read: true,
    ticketId: "PS-0001",
    body: "New comment on PS-0001",
    timeLabel: "1h ago",
  },
  {
    id: "n4",
    read: true,
    ticketId: "PS-0005",
    body: "PS-0005 was resolved",
    timeLabel: "3h ago",
  },
];

// Dashboard summary, matching the overview frame.
export const DASHBOARD = {
  open: 12,
  inProgress: 4,
  resolvedThisWeek: 9,
  unassigned: 3,
  medianResolve: "3h 48m",
  byCategory: [
    { category: "Network and Access", count: 5 },
    { category: "Software and IDE", count: 4 },
    { category: "Git and GitHub", count: 3 },
    { category: "Accounts and LMS", count: 2 },
    { category: "Hardware and AV", count: 1 },
    { category: "Healthcare IT", count: 1 },
  ],
  needsAttention: ["PS-0001", "PS-0002", "PS-0007"],
  recentActivity: [
    {
      actorId: "priya",
      action: "opened",
      ticketId: "PS-0003",
      timeLabel: "1h ago",
    },
    {
      actorId: "andre",
      action: "resolved",
      ticketId: "PS-0005",
      timeLabel: "3h ago",
    },
    {
      actorId: "jose",
      action: "opened",
      ticketId: "PS-0004",
      timeLabel: "3h ago",
    },
    {
      actorId: "maria",
      action: "closed",
      ticketId: "PS-0006",
      timeLabel: "1d ago",
      flaggedForKb: true,
    },
  ],
};

export function getProfile(id: string | null): Profile | null {
  return id ? (PROFILES[id] ?? null) : null;
}

export function getTicket(id: string): Ticket | undefined {
  return TICKETS.find((ticket) => ticket.id === id);
}

export function getComments(ticketId: string): Comment[] {
  return COMMENTS.filter((comment) => comment.ticketId === ticketId);
}

export function getActivity(ticketId: string): Activity[] {
  return ACTIVITY.filter((event) => event.ticketId === ticketId);
}

export function ticketsForLearner(learnerId: string): Ticket[] {
  return TICKETS.filter((ticket) => ticket.submittedById === learnerId);
}
