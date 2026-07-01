import { notFound, redirect } from "next/navigation";

import { TicketDetail } from "@/components/tickets/ticket-detail";
import {
  getSessionProfile,
  getTicketByReference,
  listComments,
  listProfiles,
} from "@/lib/queries";

export default async function TicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const profile = await getSessionProfile();
  if (!profile) redirect("/sign-in");

  const ticket = await getTicketByReference(id);
  if (!ticket) notFound();

  const [comments, people] = await Promise.all([
    listComments(ticket.id),
    listProfiles(),
  ]);

  return (
    <TicketDetail
      ticket={ticket}
      comments={comments}
      profiles={people.map((p) => ({ id: p.id, fullName: p.fullName }))}
      role={profile.role}
      currentUserId={profile.id}
    />
  );
}
