import { cn } from "@/lib/utils";

// A placeholder block in the shape of the content it stands in for. Hidden
// from assistive tech; the loading screens that compose it announce nothing
// because the real page replaces them within moments.
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "bg-hover-surface rounded-control animate-pulse",
        className,
      )}
      aria-hidden
    />
  );
}
