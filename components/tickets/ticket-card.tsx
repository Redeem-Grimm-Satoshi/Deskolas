import Link from "next/link";

import { Avatar } from "@/components/ui/avatar";
import { PriorityLabel } from "@/components/ui/priority-label";
import { StatusPill } from "@/components/ui/status-pill";
import { focusRing } from "@/lib/styles";
import { SPINE_CLASS } from "@/lib/ticket-view";
import type {
  TicketCategory,
  TicketPriority,
  TicketStatus,
} from "@/lib/tickets";
import { cn } from "@/lib/utils";

type Assignee = { name: string; src?: string | null };

type TicketCardProps = {
  id: string;
  title: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: TicketCategory | string;
  assignee?: Assignee | null;
  updatedLabel: string;
  href: string;
};

function Separator() {
  return (
    <span
      className="bg-border-strong size-[3px] shrink-0 rounded-full"
      aria-hidden
    />
  );
}

export function TicketCard({
  id,
  title,
  status,
  priority,
  category,
  assignee,
  updatedLabel,
  href,
}: TicketCardProps) {
  const isClosed = status === "closed";

  return (
    <Link
      href={href}
      className={cn(
        "rounded-card border-border bg-surface flex items-stretch gap-3.5 border px-4 py-3.5",
        "hover:border-border-strong transition-colors duration-150 ease-out",
        focusRing,
      )}
    >
      {/* Status spine: an inset bar, never a border on the rounded card. */}
      <span
        className={cn("w-1 shrink-0 rounded-full", SPINE_CLASS[status])}
        aria-hidden
      />

      {/* Stub: the mono ID, divided from the body by the perforation. */}
      <div className="border-border flex shrink-0 items-center border-r border-dashed pr-3.5">
        <span className="text-text-muted font-mono text-[12px] tabular-nums">
          {id}
        </span>
      </div>

      {/* Body */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3
            className={cn(
              "truncate text-[14px] font-medium",
              isClosed ? "text-text-2" : "text-text",
            )}
          >
            {title}
          </h3>
          <StatusPill status={status} className="ml-auto" />
        </div>
        <div className="text-text-2 mt-[5px] flex items-center gap-2 text-[12px]">
          <span className="truncate">{category}</span>
          <Separator />
          <PriorityLabel priority={priority} />
          <Separator />
          {assignee ? (
            <span className="flex min-w-0 items-center gap-1.5">
              <Avatar name={assignee.name} src={assignee.src} size={16} />
              <span className="truncate">{assignee.name}</span>
            </span>
          ) : (
            <span className="text-text-muted">Unassigned</span>
          )}
          <span className="text-text-muted ml-auto shrink-0">
            {updatedLabel}
          </span>
        </div>
      </div>
    </Link>
  );
}
