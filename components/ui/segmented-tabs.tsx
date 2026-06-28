"use client";

import { focusRing } from "@/lib/styles";
import { cn } from "@/lib/utils";

type Option<T extends string> = { value: T; label: string };

export function SegmentedTabs<T extends string>({
  options,
  value,
  onChange,
  className,
}: {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}) {
  return (
    <div
      className={cn("inline-flex items-center gap-1", className)}
      role="tablist"
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option.value)}
            className={cn(
              "rounded-control h-8 px-3 text-[13px] font-medium transition-colors duration-150 ease-out",
              active
                ? "border-border bg-surface text-text border"
                : "text-text-2 hover:text-text border border-transparent",
              focusRing,
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
