import { TicketsBoard } from "@/components/tickets/tickets-board";
import { listTickets } from "@/lib/queries";

export default async function TicketsPage() {
  const tickets = await listTickets();
  return <TicketsBoard tickets={tickets} />;
}
