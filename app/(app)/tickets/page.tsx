import { Suspense } from "react";

import { TicketsBoard } from "@/components/tickets/tickets-board";
import { listTickets } from "@/lib/queries";

// The board reads its filters from the URL with useSearchParams, which needs
// a Suspense boundary above it or the build warns.
export default async function TicketsPage() {
  const tickets = await listTickets();
  return (
    <Suspense>
      <TicketsBoard tickets={tickets} />
    </Suspense>
  );
}
