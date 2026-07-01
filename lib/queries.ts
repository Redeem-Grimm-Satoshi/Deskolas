// Server-side data access. Import only from server components and server
// actions. RLS runs on every query, so these return exactly what the signed-in
// user is allowed to see.

import { cache } from "react";

import { relativeTime } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";
import type {
  Role,
  SessionProfile,
  TicketCategory,
  TicketPriority,
  TicketStatus,
} from "@/lib/tickets";

export type { SessionProfile };

// Deduplicated per request: the layout and the page both call it.
export const getSessionProfile = cache(
  async (): Promise<SessionProfile | null> => {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data } = await supabase
      .from("profiles")
      .select("id, full_name, email, role")
      .eq("id", user.id)
      .maybeSingle();
    if (!data) return null;

    return {
      id: data.id,
      fullName: data.full_name,
      email: data.email ?? user.email ?? "",
      role: data.role as Role,
    };
  },
);

type Named = { id: string; full_name: string } | null;

type TicketRow = {
  id: string;
  reference: string;
  title: string;
  description: string;
  category: string;
  priority: TicketPriority;
  status: TicketStatus;
  submitted_by: string;
  assigned_to: string | null;
  resolution_notes: string | null;
  is_candidate_article: boolean;
  kb_article_url: string | null;
  created_at: string;
  updated_at: string;
  submitter: Named;
  assignee: Named;
};

const TICKET_SELECT = `
  id, reference, title, description, category, priority, status,
  submitted_by, assigned_to, resolution_notes, is_candidate_article,
  kb_article_url, created_at, updated_at,
  submitter:profiles!tickets_submitted_by_fkey(id, full_name),
  assignee:profiles!tickets_assigned_to_fkey(id, full_name)
`;

export type TicketView = {
  id: string;
  reference: string;
  title: string;
  description: string;
  category: TicketCategory | string;
  priority: TicketPriority;
  status: TicketStatus;
  submitterId: string;
  submitterName: string;
  assigneeId: string | null;
  assigneeName: string | null;
  resolutionNotes: string | null;
  isCandidate: boolean;
  kbUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

function toView(row: TicketRow): TicketView {
  return {
    id: row.id,
    reference: row.reference,
    title: row.title,
    description: row.description,
    category: row.category,
    priority: row.priority,
    status: row.status,
    submitterId: row.submitted_by,
    submitterName: row.submitter?.full_name ?? "Unknown",
    assigneeId: row.assigned_to,
    assigneeName: row.assignee?.full_name ?? null,
    resolutionNotes: row.resolution_notes,
    isCandidate: row.is_candidate_article,
    kbUrl: row.kb_article_url,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function listTickets(): Promise<TicketView[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("tickets")
    .select(TICKET_SELECT)
    .order("created_at", { ascending: false });
  return ((data ?? []) as unknown as TicketRow[]).map(toView);
}

export async function listMyTickets(userId: string): Promise<TicketView[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("tickets")
    .select(TICKET_SELECT)
    .eq("submitted_by", userId)
    .order("created_at", { ascending: false });
  return ((data ?? []) as unknown as TicketRow[]).map(toView);
}

export async function getTicketByReference(
  reference: string,
): Promise<TicketView | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("tickets")
    .select(TICKET_SELECT)
    .eq("reference", reference)
    .maybeSingle();
  return data ? toView(data as unknown as TicketRow) : null;
}

export type CommentView = {
  id: string;
  body: string;
  authorName: string;
  timeLabel: string;
};

export async function listComments(ticketId: string): Promise<CommentView[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("comments")
    .select(
      "id, body, created_at, author:profiles!comments_author_id_fkey(id, full_name)",
    )
    .eq("ticket_id", ticketId)
    .order("created_at", { ascending: true });

  const rows = (data ?? []) as unknown as {
    id: string;
    body: string;
    created_at: string;
    author: { full_name: string } | null;
  }[];

  return rows.map((row) => ({
    id: row.id,
    body: row.body,
    authorName: row.author?.full_name ?? "Unknown",
    timeLabel: relativeTime(row.created_at),
  }));
}

export type PersonView = {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  joinedAt: string;
};

export async function listProfiles(): Promise<PersonView[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("id, full_name, email, role, created_at")
    .order("created_at", { ascending: true });

  return (data ?? []).map((row) => ({
    id: row.id,
    fullName: row.full_name,
    email: row.email ?? "",
    role: row.role as Role,
    joinedAt: row.created_at,
  }));
}

export type InviteView = { email: string; role: Role; invitedAt: string };

export async function listPendingInvites(): Promise<InviteView[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("invites")
    .select("email, role, created_at, accepted_at")
    .is("accepted_at", null)
    .order("created_at", { ascending: false });

  return (data ?? []).map((row) => ({
    email: row.email,
    role: row.role as Role,
    invitedAt: row.created_at,
  }));
}

function formatDuration(ms: number): string {
  const totalMinutes = Math.round(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes}m`;
  return `${hours}h ${minutes}m`;
}

export type DashboardData = {
  open: number;
  inProgress: number;
  resolved: number;
  unassigned: number;
  medianResolve: string;
  byCategory: { category: string; count: number }[];
  needsAttention: TicketView[];
  recentActivity: {
    actorName: string;
    action: string;
    reference: string;
    timeLabel: string;
  }[];
};

export async function getDashboard(): Promise<DashboardData> {
  const tickets = await listTickets();

  const open = tickets.filter(
    (t) => t.status === "new" || t.status === "in_progress",
  ).length;
  const inProgress = tickets.filter((t) => t.status === "in_progress").length;
  const resolved = tickets.filter((t) => t.status === "resolved").length;
  const unassigned = tickets.filter(
    (t) => !t.assigneeId && t.status !== "closed",
  ).length;

  const categoryCounts = new Map<string, number>();
  for (const t of tickets) {
    categoryCounts.set(t.category, (categoryCounts.get(t.category) ?? 0) + 1);
  }
  const byCategory = [...categoryCounts.entries()]
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);

  const priorityWeight: Record<TicketPriority, number> = {
    high: 0,
    medium: 1,
    low: 2,
  };
  const needsAttention = tickets
    .filter((t) => !t.assigneeId && t.status !== "closed")
    .sort((a, b) => priorityWeight[a.priority] - priorityWeight[b.priority])
    .slice(0, 3);

  const durations = tickets
    .filter((t) => t.status === "resolved" || t.status === "closed")
    .map(
      (t) => new Date(t.updatedAt).getTime() - new Date(t.createdAt).getTime(),
    )
    .sort((a, b) => a - b);
  const medianResolve =
    durations.length === 0
      ? "n/a"
      : formatDuration(durations[Math.floor(durations.length / 2)]);

  const recentActivity = [...tickets]
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
    .slice(0, 5)
    .map((t) => {
      if (t.status === "resolved" || t.status === "closed") {
        return {
          actorName: t.assigneeName ?? t.submitterName,
          action: t.status === "closed" ? "closed" : "resolved",
          reference: t.reference,
          timeLabel: relativeTime(t.updatedAt),
        };
      }
      return {
        actorName: t.submitterName,
        action: "opened",
        reference: t.reference,
        timeLabel: relativeTime(t.createdAt),
      };
    });

  return {
    open,
    inProgress,
    resolved,
    unassigned,
    medianResolve,
    byCategory,
    needsAttention,
    recentActivity,
  };
}
