// The ticket domain vocabulary. Status and priority drive the spine color, the
// pill, and the priority label, so they live in one place and every component
// derives from them rather than restating the strings.

// Two roles: a member is anyone with an account; an admin also oversees.
export const ROLES = ["member", "admin"] as const;
export type Role = (typeof ROLES)[number];
export const ROLE_LABELS: Record<Role, string> = {
  member: "Member",
  admin: "Admin",
};

export type SessionProfile = {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  avatarUrl: string | null;
};

export const TICKET_STATUSES = [
  "new",
  "in_progress",
  "resolved",
  "closed",
] as const;

export type TicketStatus = (typeof TICKET_STATUSES)[number];

export const STATUS_LABELS: Record<TicketStatus, string> = {
  new: "New",
  in_progress: "In progress",
  resolved: "Resolved",
  closed: "Closed",
};

export const TICKET_PRIORITIES = ["low", "medium", "high"] as const;

export type TicketPriority = (typeof TICKET_PRIORITIES)[number];

export const PRIORITY_LABELS: Record<TicketPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

// The categories the cohort opens tickets against, mirrored from the dashboard.
export const TICKET_CATEGORIES = [
  "Network and Access",
  "Software and IDE",
  "Git and GitHub",
  "Accounts and LMS",
  "Hardware and AV",
  "Healthcare IT",
] as const;

export type TicketCategory = (typeof TICKET_CATEGORIES)[number];
