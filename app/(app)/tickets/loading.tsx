import { AppTopBar } from "@/components/app/app-top-bar";
import { NewTicketButton } from "@/components/tickets/new-ticket-dialog";
import { Skeleton } from "@/components/ui/skeleton";

// Mirrors the queue layout in tickets-board.tsx so nothing moves when the
// data arrives: the status tabs and two selects, the count line, then cards.
export default function TicketsLoading() {
  return (
    <>
      <AppTopBar
        title="Tickets"
        search={<Skeleton className="h-9 w-72" />}
        actions={<NewTicketButton />}
      />
      <div className="flex flex-col gap-4 p-6 max-sm:p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1">
            <Skeleton className="h-8 w-12" />
            <Skeleton className="h-8 w-14" />
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-16" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-9 w-44" />
            <Skeleton className="h-9 w-40" />
          </div>
        </div>
        <Skeleton className="h-5 w-40" />
        <div className="flex flex-col gap-2">
          {Array.from({ length: 6 }, (_, index) => (
            <Skeleton key={index} className="rounded-card h-[72px] w-full" />
          ))}
        </div>
      </div>
    </>
  );
}
