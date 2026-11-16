"use client";

import { LifeBuoy } from "lucide-react";

import { focusRing } from "@/lib/styles";
import { cn } from "@/lib/utils";
import { useTour } from "./tour-provider";

// Sits at the foot of the sidebar nav so the tour is always one click away.
// When the registry has steps this person has not seen, it becomes a
// "What's new" entry with the count, and starts just those steps.
export function TourLauncher() {
  const { start, hasNewSteps, newCount } = useTour();

  return (
    <button
      type="button"
      data-tour-launch
      onClick={() => start(hasNewSteps ? "new" : "full")}
      className={cn(
        "rounded-control text-text-2 hover:text-text mt-auto flex h-9 w-full items-center gap-2.5 px-2.5 text-left text-[14px] font-medium transition-colors duration-150 ease-out",
        focusRing,
      )}
    >
      <LifeBuoy
        className="size-[18px] shrink-0"
        strokeWidth={1.5}
        aria-hidden
      />
      <span className="flex-1 truncate">
        {hasNewSteps ? "What's new" : "Take the tour"}
      </span>
      {hasNewSteps ? (
        <span className="font-mono text-[12px] tabular-nums">{newCount}</span>
      ) : null}
    </button>
  );
}
