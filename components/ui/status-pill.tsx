import { STATUS_LABELS, type TicketStatus } from "@/lib/tickets";
import { cn } from "@/lib/utils";

// Tint background plus a readable label. Always paired with the ticket spine;
// color is never the sole status signal.
const styles: Record<TicketStatus, string> = {
  new: "bg-pill-new-bg text-pill-new-text",
  in_progress: "bg-pill-progress-bg text-pill-progress-text",
  resolved: "bg-pill-resolved-bg text-pill-resolved-text",
  closed: "bg-pill-closed-bg text-pill-closed-text",
};

export function StatusPill({
  status,
  className,
}: {
  status: TicketStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-[3px] text-[12px] font-medium whitespace-nowrap",
        styles[status],
        className,
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
