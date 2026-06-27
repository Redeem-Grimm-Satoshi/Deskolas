import type { LucideIcon } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

type InputProps = Omit<React.ComponentProps<"input">, "size"> & {
  label?: string;
  error?: string;
  leadingIcon?: LucideIcon;
  /** 40px inside dialogs, 36px elsewhere. */
  fieldSize?: "md" | "dialog";
};

export function Input({
  className,
  label,
  error,
  leadingIcon: LeadingIcon,
  fieldSize = "md",
  id,
  disabled,
  ...props
}: InputProps) {
  const generatedId = React.useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;

  return (
    <div className="flex flex-col">
      {label ? (
        <label
          htmlFor={inputId}
          className="text-text-2 mb-1.5 text-[12px] leading-4 font-medium"
        >
          {label}
        </label>
      ) : null}
      <div
        className={cn(
          "rounded-control bg-bg text-text flex items-center gap-2 border px-3",
          "transition-[border-color,box-shadow] duration-150 ease-out",
          "focus-within:border-accent focus-within:[box-shadow:0_0_0_3px_var(--input-focus-ring)]",
          fieldSize === "dialog" ? "h-10" : "h-9",
          error ? "border-danger" : "border-border",
          disabled && "bg-surface opacity-50",
        )}
      >
        {LeadingIcon ? (
          <LeadingIcon
            className="text-text-muted size-4 shrink-0"
            strokeWidth={1.5}
            aria-hidden
          />
        ) : null}
        <input
          id={inputId}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            "placeholder:text-text-muted w-full bg-transparent text-[14px] outline-none disabled:cursor-not-allowed",
            className,
          )}
          {...props}
        />
      </div>
      {error ? (
        <p
          id={errorId}
          className="text-prio-high mt-1.5 text-[13px] leading-[18px]"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
