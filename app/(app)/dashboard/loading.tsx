import { AppTopBar } from "@/components/app/app-top-bar";
import { NewTicketButton } from "@/components/tickets/new-ticket-dialog";
import { Skeleton } from "@/components/ui/skeleton";

// Mirrors dashboard/page.tsx: the overview heading, four metric tiles, then
// the two-column panel grid.
export default function DashboardLoading() {
  return (
    <>
      <AppTopBar title="Dashboard" actions={<NewTicketButton />} />
      <div className="flex flex-col gap-6 p-6 max-sm:p-4">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <Skeleton className="h-7 w-28" />
          <Skeleton className="h-4 w-32" />
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="rounded-card h-[110px]" />
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <div className="flex flex-col gap-6">
            <Skeleton className="rounded-card h-64" />
            <Skeleton className="rounded-card h-56" />
          </div>
          <Skeleton className="rounded-card h-80" />
        </div>
      </div>
    </>
  );
}
