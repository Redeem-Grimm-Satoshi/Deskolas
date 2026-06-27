"use client";

import * as RadixSelect from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import * as React from "react";

import { focusRing } from "@/lib/styles";
import { cn } from "@/lib/utils";

type Option = { value: string; label: string };

type SelectProps = {
  label?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  options: Option[];
  placeholder?: string;
  disabled?: boolean;
  fieldSize?: "md" | "dialog";
  id?: string;
  className?: string;
};

export function Select({
  label,
  value,
  defaultValue,
  onValueChange,
  options,
  placeholder = "Select",
  disabled,
  fieldSize = "md",
  id,
  className,
}: SelectProps) {
  const generatedId = React.useId();
  const selectId = id ?? generatedId;

  return (
    <div className="flex flex-col">
      {label ? (
        <label
          htmlFor={selectId}
          className="text-text-2 mb-1.5 text-[12px] leading-4 font-medium"
        >
          {label}
        </label>
      ) : null}
      <RadixSelect.Root
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        disabled={disabled}
      >
        <RadixSelect.Trigger
          id={selectId}
          className={cn(
            "rounded-control border-border bg-bg text-text flex items-center justify-between gap-2 border px-3 text-[14px]",
            "transition-[border-color,box-shadow] duration-150 ease-out",
            "data-[state=open]:border-accent disabled:bg-surface disabled:cursor-not-allowed disabled:opacity-50",
            "data-[placeholder]:text-text-muted",
            fieldSize === "dialog" ? "h-10" : "h-9",
            focusRing,
            className,
          )}
        >
          <RadixSelect.Value placeholder={placeholder} />
          <RadixSelect.Icon>
            <ChevronDown className="text-text-muted size-4" strokeWidth={1.5} />
          </RadixSelect.Icon>
        </RadixSelect.Trigger>
        <RadixSelect.Portal>
          <RadixSelect.Content
            position="popper"
            sideOffset={6}
            className={cn(
              "rounded-card border-border bg-surface shadow-floating z-50 min-w-[var(--radix-select-trigger-width)] overflow-hidden border p-1",
              "motion-safe:data-[state=open]:animate-[layer-in_180ms_ease-out]",
            )}
          >
            <RadixSelect.Viewport>
              {options.map((option) => (
                <RadixSelect.Item
                  key={option.value}
                  value={option.value}
                  className={cn(
                    "rounded-control text-text flex h-9 cursor-pointer items-center justify-between px-2.5 text-[14px] outline-none",
                    "data-[highlighted]:bg-hover-surface data-[state=checked]:text-accent-text",
                  )}
                >
                  <RadixSelect.ItemText>{option.label}</RadixSelect.ItemText>
                  <RadixSelect.ItemIndicator>
                    <Check className="size-4" strokeWidth={1.5} />
                  </RadixSelect.ItemIndicator>
                </RadixSelect.Item>
              ))}
            </RadixSelect.Viewport>
          </RadixSelect.Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>
    </div>
  );
}
