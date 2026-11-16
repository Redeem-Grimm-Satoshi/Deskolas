import { AppTopBar } from "@/components/app/app-top-bar";
import { NewTicketButton } from "@/components/tickets/new-ticket-dialog";
import { Skeleton } from "@/components/ui/skeleton";

// Mirrors my-tickets-list.tsx: the tabs row with the count, then the cards.
export default function MyTicketsLoading() {
  return (
    <>
      <AppTopBar
        title="My tickets"
        search={<Skeleton className="h-9 w-72" />}
        actions={<NewTicketButton />}
      />
      <div className="flex flex-col gap-4 p-6 max-sm:p-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Skeleton className="h-8 w-12" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
          </div>
          <Skeleton className="h-5 w-16" />
        </div>
        <div className="flex flex-col gap-2">
          {Array.from({ length: 5 }, (_, index) => (
            <Skeleton key={index} className="rounded-card h-[72px] w-full" />
          ))}
        </div>
      </div>
    </>
  );
}
