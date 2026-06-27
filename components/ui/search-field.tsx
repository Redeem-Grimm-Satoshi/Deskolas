import { Search } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

type SearchFieldProps = Omit<React.ComponentProps<"input">, "type"> & {
  "aria-label"?: string;
};

export function SearchField({
  className,
  placeholder = "Search tickets",
  "aria-label": ariaLabel = "Search tickets",
  ...props
}: SearchFieldProps) {
  return (
    <div
      className={cn(
        "rounded-control border-border bg-bg text-text flex h-9 items-center gap-2 border px-3",
        "transition-[border-color,box-shadow] duration-150 ease-out",
        "focus-within:border-accent focus-within:[box-shadow:0_0_0_3px_var(--input-focus-ring)]",
        className,
      )}
    >
      <Search
        className="text-text-muted size-4 shrink-0"
        strokeWidth={1.5}
        aria-hidden
      />
      <input
        type="search"
        aria-label={ariaLabel}
        placeholder={placeholder}
        className="placeholder:text-text-muted w-full bg-transparent text-[14px] outline-none [&::-webkit-search-cancel-button]:appearance-none"
        {...props}
      />
    </div>
  );
}
