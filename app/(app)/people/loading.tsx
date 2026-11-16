import { AppTopBar } from "@/components/app/app-top-bar";
import { Skeleton } from "@/components/ui/skeleton";

// Mirrors people-table.tsx: the invite box, then the members card with its
// header and a few rows.
export default function PeopleLoading() {
  return (
    <>
      <AppTopBar title="People" />
      <div className="flex flex-col gap-6 p-6 max-sm:p-4">
        <section className="rounded-card border-border bg-surface border p-5">
          <Skeleton className="h-5 w-44" />
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Skeleton className="h-9 w-64 max-w-full" />
            <Skeleton className="h-9 w-36" />
            <Skeleton className="h-9 w-36" />
          </div>
          <Skeleton className="mt-2.5 h-4 w-full max-w-xl" />
        </section>

        <section className="rounded-card border-border bg-surface border">
          <div className="border-border flex items-center justify-between border-b px-5 py-3">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
          {Array.from({ length: 5 }, (_, index) => (
            <div
              key={index}
              className="border-border flex h-14 items-center gap-3 border-t px-5 first:border-t-0"
            >
              <Skeleton className="size-8 shrink-0 rounded-full" />
              <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <Skeleton className="h-4 w-40 max-w-full" />
                <Skeleton className="h-3 w-56 max-w-full" />
              </div>
              <Skeleton className="h-6 w-16" />
            </div>
          ))}
        </section>
      </div>
    </>
  );
}
