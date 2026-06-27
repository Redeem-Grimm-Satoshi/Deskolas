import { PRIORITY_LABELS, type TicketPriority } from "@/lib/tickets";
import { cn } from "@/lib/utils";

// A whisper, not a shout: a small dot plus a label sharing one color, never a
// filled block. Low stays at weight 400; medium and high lift to 500.
const styles: Record<
  TicketPriority,
  { dot: string; text: string; weight: string }
> = {
  low: { dot: "bg-prio-low", text: "text-prio-low", weight: "font-normal" },
  medium: {
    dot: "bg-prio-medium",
    text: "text-prio-medium",
    weight: "font-medium",
  },
  high: { dot: "bg-prio-high", text: "text-prio-high", weight: "font-medium" },
};

export function PriorityLabel({
  priority,
  className,
}: {
  priority: TicketPriority;
  className?: string;
}) {
  const style = styles[priority];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-[5px] text-[12px]",
        style.weight,
        className,
      )}
    >
      <span
        className={cn("size-[5px] shrink-0 rounded-full", style.dot)}
        aria-hidden
      />
      <span className={style.text}>{PRIORITY_LABELS[priority]}</span>
    </span>
  );
}
