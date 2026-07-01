import { relativeTime } from "@/lib/format";
import type { TicketView } from "@/lib/queries";
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

export function sortTickets(tickets: TicketView[]): TicketView[] {
  return [...tickets].sort(
    (a, b) =>
      STATUS_ORDER[a.status] - STATUS_ORDER[b.status] ||
      PRIORITY_WEIGHT[a.priority] - PRIORITY_WEIGHT[b.priority],
  );
}

// Props for the perforated-stub ticket card. The stub shows the reference, and
// the card links to the ticket by that reference.
export function ticketCardProps(ticket: TicketView) {
  return {
    id: ticket.reference,
    title: ticket.title,
    status: ticket.status,
    priority: ticket.priority,
    category: ticket.category,
    assignee: ticket.assigneeName ? { name: ticket.assigneeName } : null,
    updatedLabel: relativeTime(ticket.updatedAt),
    href: `/tickets/${ticket.reference}`,
  };
}
