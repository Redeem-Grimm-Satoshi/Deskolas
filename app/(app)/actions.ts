"use server";

import { revalidatePath } from "next/cache";

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

export async function promoteTicket(ticketId: string): Promise<Result> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("tickets")
    .update({ is_candidate_article: true })
    .eq("id", ticketId);
  if (error) return { error: "Could not promote the ticket." };
  revalidateLists();
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
