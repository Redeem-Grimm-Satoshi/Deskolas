import * as React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type TourCardProps = {
  label: string;
  title: string;
  body: string;
  index: number;
  total: number;
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
  className?: string;
  style?: React.CSSProperties;
  ref?: React.Ref<HTMLDivElement>;
};

// The floating step card. Presentational so the component library can show
// it; the overlay owns positioning and keyboard handling. The dashed hairline
// between the copy and the actions is the one echo of the perforation allowed
// outside ticket cards.
export function TourCard({
  label,
  title,
  body,
  index,
  total,
  onNext,
  onBack,
  onSkip,
  className,
  style,
  ref,
}: TourCardProps) {
  const titleId = React.useId();
  const bodyId = React.useId();
  const isFirst = index === 0;
  const isLast = index === total - 1;

  return (
    <div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={bodyId}
      tabIndex={-1}
      style={style}
      className={cn(
        "rounded-card border-border bg-surface shadow-floating flex w-[320px] flex-col gap-3 border p-4 outline-none",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-text-muted text-[11px] leading-[14px] font-medium tracking-[0.06em] uppercase">
          {label}
        </span>
        <span className="text-text-muted font-mono text-[12px] tabular-nums">
          {index + 1} / {total}
        </span>
      </div>

      <span
        className="bg-hover-surface block h-0.5 w-full overflow-hidden rounded-full"
        aria-hidden
      >
        <span
          className="bg-text-muted block h-full w-full origin-left rounded-full transition-transform duration-200 ease-out"
          style={{ transform: `scaleX(${(index + 1) / total})` }}
        />
      </span>

      <div>
        <h2 id={titleId} className="text-heading text-text font-semibold">
          {title}
        </h2>
        <p id={bodyId} className="text-text-2 mt-1 text-[14px] leading-5">
          {body}
        </p>
      </div>

      <div className="border-border border-t border-dashed" aria-hidden />

      <div className="flex items-center justify-between gap-2">
        {isLast ? (
          <span />
        ) : (
          <Button variant="ghost" onClick={onSkip}>
            Skip tour
          </Button>
        )}
        <div className="flex gap-2">
          {isFirst ? null : (
            <Button variant="secondary" onClick={onBack}>
              Back
            </Button>
          )}
          <Button onClick={onNext}>{isLast ? "Done" : "Next"}</Button>
        </div>
      </div>
    </div>
  );
}
