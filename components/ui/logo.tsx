import { cn } from "@/lib/utils";

// The approved brand mark: a flat white D monogram inside an accent rounded
// square. Geometry only, no gradient or glow. The square is the accent token;
// the D is knocked out with fill-rule evenodd. Never substitute the lucide
// Ticket glyph here (that icon belongs to the Tickets nav item only).
export function BrandMark({
  size = 36,
  className,
  title,
}: {
  size?: number;
  className?: string;
  title?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={cn("text-accent", className)}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <rect width="64" height="64" rx="18" fill="currentColor" />
      <path
        transform="translate(8,8) scale(2)"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5 4 H11 A8 8 0 0 1 11 20 H5 Z M8 8 V16 H10 A4 4 0 0 0 10 8 Z"
        fill="#fff"
      />
    </svg>
  );
}

// The full lockup: mark plus wordmark, with an optional mono sub-label (the
// cohort code in app chrome, or the anchor tagline in auth).
export function Logo({ subLabel }: { subLabel?: string }) {
  return (
    <div className="flex items-center gap-3">
      <BrandMark />
      <div className="flex flex-col">
        <span className="text-heading text-text font-semibold tracking-[-0.02em]">
          Deskolas
        </span>
        {subLabel ? (
          <span className="text-text-muted font-mono text-[11px] leading-[14px] tabular-nums">
            {subLabel}
          </span>
        ) : null}
      </div>
    </div>
  );
}
