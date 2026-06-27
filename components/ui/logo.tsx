import { Ticket } from "lucide-react";

import { cn } from "@/lib/utils";

// The brand mark: a flat blue square with a white Ticket glyph. The 10px radius
// is the one value the design brief fixes outside the control/card scale; it
// sits optically between an 8px control and a 12px card. Never gradient, glow,
// notch, or perforate the mark.
export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "bg-accent flex size-9 items-center justify-center rounded-[10px]",
        className,
      )}
    >
      <Ticket className="size-[18px] text-white" strokeWidth={1.5} />
    </span>
  );
}

// The full lockup: mark plus wordmark, with an optional mono sub-label
// (the cohort code in app chrome, or the anchor tagline in auth).
export function Logo({ subLabel }: { subLabel?: string }) {
  return (
    <div className="flex items-center gap-3">
      <BrandMark />
      <div className="flex flex-col">
        <span className="text-heading text-text font-semibold">Deskolas</span>
        {subLabel ? (
          <span className="text-text-muted font-mono text-[11px] leading-[14px] tabular-nums">
            {subLabel}
          </span>
        ) : null}
      </div>
    </div>
  );
}
