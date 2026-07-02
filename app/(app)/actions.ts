"use server";

import { revalidatePath } from "next/cache";

import { submitToKb } from "@/lib/kb";
import { getSessionProfile } from "@/lib/queries";
import { createClient } from "@/lib/supabase/server";
import type { TicketStatus } from "@/lib/tickets";
import { newTicketSchema } from "@/lib/validations/ticket";

type Result = { error?: string };

// Refresh the list-style routes after a change. The detail page refreshes
// itself client-side after the action returns.
function revalidateLists() {
  revalidatePath("/tickets");
  revalidatePath("/my-tickets");
  revalidatePath("/dashboard");
}

export async function createTicket(input: {
  title: string;
  description: string;
  category: string;
  priority: string;
}): Promise<Result & { reference?: string }> {
  const parsed = newTicketSchema.safeParse(input);
  if (!parsed.success) return { error: "Check the form and try again." };

  const profile = await getSessionProfile();
  if (!profile) return { error: "Sign in first." };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tickets")
    .insert({
      title: parsed.data.title,
      description: parsed.data.description,
      category: parsed.data.category,
      priority: parsed.data.priority,
      submitted_by: profile.id,
    })
    .select("reference")
    .single();

  if (error) return { error: "Could not open the ticket. Try again." };
  revalidateLists();
  return { reference: data.reference };
}

export async function claimTicket(ticketId: string): Promise<Result> {
  const supabase = await createClient();
  const { error } = await supabase.rpc("claim_ticket", { ticket_id: ticketId });
  if (error) return { error: "That ticket is not open to claim." };
  revalidateLists();
  return {};
}

export async function setTicketStatus(
  ticketId: string,
  status: TicketStatus,
): Promise<Result> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("tickets")
    .update({ status })
    .eq("id", ticketId);
  if (error) return { error: "Could not update the status." };
  revalidateLists();
  return {};
}

export async function resolveTicket(
  ticketId: string,
  notes: string,
): Promise<Result> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("tickets")
    .update({ status: "resolved", resolution_notes: notes.trim() || null })
    .eq("id", ticketId);
  if (error) return { error: "Could not resolve the ticket." };
  revalidateLists();
  return {};
}

export async function reassignTicket(
  ticketId: string,
  assigneeId: string | null,
): Promise<Result> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("tickets")
    .update({ assigned_to: assigneeId })
    .eq("id", ticketId);
  if (error) return { error: "Could not reassign the ticket." };
  revalidateLists();
  return {};
}

export async function updateTicketMeta(
  ticketId: string,
  patch: { priority?: string; category?: string },
): Promise<Result> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("tickets")
    .update(patch)
    .eq("id", ticketId);
  if (error) return { error: "Could not update the ticket." };
  revalidateLists();
  return {};
}

// Promote a resolved ticket to the Learners Hub knowledge base: mark it a
// candidate locally, then hand it off to their submissions API. The local flag
// is set first so the intent survives even if the handoff needs a retry (the
// reference is the idempotency key, so re-promoting is safe).
export async function promoteTicket(
  ticketId: string,
  options: { includeNotes?: boolean } = {},
): Promise<Result> {
  const { includeNotes = true } = options;
  const supabase = await createClient();

  const { data: ticket } = await supabase
    .from("tickets")
    .select(
      "id, reference, title, description, category, status, resolution_notes, assignee:profiles!tickets_assigned_to_fkey(full_name)",
    )
    .eq("id", ticketId)
    .maybeSingle();

  if (!ticket) return { error: "Ticket not found." };
  if (ticket.status !== "resolved" && ticket.status !== "closed") {
    return {
      error: "Resolve the ticket before sending it to the Knowledge Base.",
    };
  }

  const { error: flagError } = await supabase
    .from("tickets")
    .update({ is_candidate_article: true })
    .eq("id", ticketId);
  if (flagError) return { error: "Could not promote the ticket." };

  const assignee = ticket.assignee as { full_name: string } | null;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const result = await submitToKb({
    reference: ticket.reference,
    title: ticket.title,
    problem: ticket.description,
    solution: includeNotes ? (ticket.resolution_notes ?? "") : "",
    category: ticket.category,
    resolvedBy: assignee?.full_name ?? "Deskolas",
    sourceUrl: `${siteUrl}/tickets/${ticket.reference}`,
  });

  if (!result.ok) {
    revalidateLists();
    revalidatePath(`/tickets/${ticket.reference}`);
    return { error: result.error };
  }

  await supabase
    .from("tickets")
    .update({
      kb_submission_id: result.submissionId,
      kb_submitted_at: new Date().toISOString(),
    })
    .eq("id", ticketId);

  revalidateLists();
  revalidatePath(`/tickets/${ticket.reference}`);
  return {};
}

export async function addComment(
  ticketId: string,
  body: string,
): Promise<Result> {
  const trimmed = body.trim();
  if (!trimmed) return { error: "Write a comment first." };

  const profile = await getSessionProfile();
  if (!profile) return { error: "Sign in first." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("comments")
    .insert({ ticket_id: ticketId, author_id: profile.id, body: trimmed });
  if (error) return { error: "Could not add the comment." };
  return {};
}

// Adds the email to the sign-up allowlist. No email is sent; the inviter tells
// the person to sign up with this address.
export async function addInvite(email: string, role: string): Promise<Result> {
  const trimmed = email.trim().toLowerCase();
  if (!trimmed) return { error: "Enter an email to invite." };

  const profile = await getSessionProfile();
  if (!profile) return { error: "Sign in first." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("invites")
    .upsert(
      { email: trimmed, role, invited_by: profile.id },
      { onConflict: "email" },
    );
  if (error) return { error: "Could not add the invite." };
  revalidatePath("/people");
  return {};
}

export async function updateMemberRole(
  userId: string,
  role: string,
): Promise<Result> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ role })
    .eq("id", userId);
  if (error) return { error: "Could not change the role." };
  revalidatePath("/people");
  return {};
}

// The file itself is uploaded from the browser (storage RLS limits people to
// their own folder); this records the resulting URL, and only one that really
// points into the caller's own avatar folder.
export async function updateProfileAvatar(url: string): Promise<Result> {
  const profile = await getSessionProfile();
  if (!profile) return { error: "Sign in first." };

  const prefix = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${profile.id}/`;
  if (!url.startsWith(prefix)) {
    return { error: "That file is not your avatar." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ avatar_url: url })
    .eq("id", profile.id);
  if (error) return { error: "Could not save your photo." };
  revalidatePath("/", "layout");
  return {};
}

export async function markAllNotificationsRead(): Promise<Result> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("read", false);
  if (error) return { error: "Could not mark notifications read." };
  return {};
}

export async function updateProfileName(fullName: string): Promise<Result> {
  const trimmed = fullName.trim();
  if (!trimmed) return { error: "Name cannot be empty." };

  const profile = await getSessionProfile();
  if (!profile) return { error: "Sign in first." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ full_name: trimmed })
    .eq("id", profile.id);
  if (error) return { error: "Could not save your profile." };
  revalidatePath("/settings");
  return {};
}
