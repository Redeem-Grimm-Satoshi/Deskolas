import { cn } from "@/lib/utils";

// A row in the notifications panel. Unread rows carry an accent dot and a faint
// accent wash; read rows go quiet. Mono ticket IDs in the message render in
// accent text, so the caller composes them inline.
export function NotificationItem({
  read,
  message,
  timeLabel,
  className,
}: {
  read: boolean;
  message: React.ReactNode;
  timeLabel: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex gap-[11px] px-4 py-[13px]",
        read ? "bg-transparent" : "bg-accent-wash",
        className,
      )}
    >
      <span
        className={cn(
          "mt-1.5 size-[7px] shrink-0 rounded-full",
          read ? "bg-transparent" : "bg-accent",
        )}
        aria-hidden
      />
      <div className="min-w-0">
        <p
          className={cn(
            "text-[13px] leading-[18px]",
            read ? "text-text-2" : "text-text",
          )}
        >
          {message}
        </p>
        <p className="text-text-muted mt-0.5 text-[12px] leading-4">
          {timeLabel}
        </p>
      </div>
    </div>
  );
}
