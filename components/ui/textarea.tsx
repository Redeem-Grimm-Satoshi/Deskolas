import * as React from "react";

import { cn } from "@/lib/utils";

type TextareaProps = React.ComponentProps<"textarea"> & {
  label?: string;
  error?: string;
};

export function Textarea({
  className,
  label,
  error,
  id,
  disabled,
  ...props
}: TextareaProps) {
  const generatedId = React.useId();
  const textareaId = id ?? generatedId;
  const errorId = `${textareaId}-error`;

  return (
    <div className="flex flex-col">
      {label ? (
        <label
          htmlFor={textareaId}
          className="text-text-2 mb-1.5 text-[12px] leading-4 font-medium"
        >
          {label}
        </label>
      ) : null}
      <textarea
        id={textareaId}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          "rounded-control bg-bg text-text min-h-20 w-full border px-3 py-[9px] text-[14px] leading-5 outline-none",
          "placeholder:text-text-muted transition-[border-color,box-shadow] duration-150 ease-out",
          "focus:border-accent focus:[box-shadow:0_0_0_3px_var(--input-focus-ring)]",
          "disabled:bg-surface disabled:cursor-not-allowed disabled:opacity-50",
          error ? "border-danger" : "border-border",
          className,
        )}
        {...props}
      />
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
