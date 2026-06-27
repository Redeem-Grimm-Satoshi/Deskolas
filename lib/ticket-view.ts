import { getProfile, type Ticket } from "@/lib/mock-data";
import type { TicketPriority, TicketStatus } from "@/lib/tickets";

// Spine color per status, shared by the ticket card and any compact ticket row.
export const SPINE_CLASS: Record<TicketStatus, string> = {
  new: "bg-st-new",
  in_progress: "bg-st-progress",
  resolved: "bg-st-resolved",
  closed: "bg-st-closed",
};

// New first, then work in progress, then resolved, then closed. High priority
// floats up within a group so position carries weight, not louder color.
const STATUS_ORDER: Record<TicketStatus, number> = {
  new: 0,
  in_progress: 1,
  resolved: 2,
  closed: 3,
};

const PRIORITY_WEIGHT: Record<TicketPriority, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

export function sortTickets(tickets: Ticket[]): Ticket[] {
  return [...tickets].sort(
    (a, b) =>
      STATUS_ORDER[a.status] - STATUS_ORDER[b.status] ||
      PRIORITY_WEIGHT[a.priority] - PRIORITY_WEIGHT[b.priority],
  );
}

export function ticketCardProps(ticket: Ticket) {
  const assignee = getProfile(ticket.assignedToId);
  return {
    id: ticket.id,
    title: ticket.title,
    status: ticket.status,
    priority: ticket.priority,
    category: ticket.category,
    assignee: assignee ? { name: assignee.fullName } : null,
    updatedLabel: ticket.updatedLabel,
    href: `/tickets/${ticket.id}`,
  };
}
