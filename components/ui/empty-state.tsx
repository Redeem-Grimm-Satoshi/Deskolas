import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

// Inviting, never apologetic. One muted icon, a heading, a line of copy, and at
// most one action.
export function EmptyState({
  icon: Icon,
  title,
  body,
  action,
  className,
}: {
  icon: LucideIcon;
  title: string;
  body: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center px-6 py-9 text-center",
        className,
      )}
    >
      <span className="border-border bg-hover-surface flex size-12 items-center justify-center rounded-full border">
        <Icon
          className="text-text-muted size-[22px]"
          strokeWidth={1.5}
          aria-hidden
        />
      </span>
      <h3 className="text-heading text-text mt-4 font-semibold">{title}</h3>
      <p className="text-text-2 mt-1 max-w-sm text-[14px] leading-5">{body}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
