import { cn } from "@/lib/utils";

// The authenticated-shell header: title left, optional inline search, then a
// right cluster (primary action and avatar). The search hides on mobile, where
// the primary action moves to a pinned bottom button in the page itself.
export function TopBar({
  title,
  search,
  children,
  className,
}: {
  title: string;
  search?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <header
      className={cn(
        "border-border flex h-14 items-center gap-4 border-b px-6 max-sm:px-4",
        className,
      )}
    >
      <h1 className="text-heading text-text shrink-0 font-semibold">{title}</h1>
      {search ? <div className="hidden min-w-0 sm:block">{search}</div> : null}
      <div className="ml-auto flex shrink-0 items-center gap-3">{children}</div>
    </header>
  );
}
