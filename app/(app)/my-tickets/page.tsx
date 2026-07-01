import { redirect } from "next/navigation";

import { MyTicketsList } from "@/components/tickets/my-tickets-list";
import { getSessionProfile, listMyTickets } from "@/lib/queries";

export default async function MyTicketsPage() {
  const profile = await getSessionProfile();
  if (!profile) redirect("/sign-in");
  const tickets = await listMyTickets(profile.id);
  return <MyTicketsList tickets={tickets} />;
}
