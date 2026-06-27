"use client";

import * as RadixSwitch from "@radix-ui/react-switch";

import { focusRing } from "@/lib/styles";
import { cn } from "@/lib/utils";

type ToggleProps = {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
  "aria-label"?: string;
};

export function Toggle({ id, ...props }: ToggleProps) {
  return (
    <RadixSwitch.Root
      id={id}
      className={cn(
        "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-150 ease-out",
        "disabled:cursor-not-allowed disabled:opacity-40",
        "data-[state=checked]:bg-accent",
        "data-[state=unchecked]:bg-border-strong light:data-[state=unchecked]:bg-border",
        focusRing,
      )}
      {...props}
    >
      <RadixSwitch.Thumb
        className={cn(
          "block size-4 translate-x-0.5 rounded-full bg-white transition-transform duration-150 ease-out",
          "data-[state=checked]:translate-x-[18px]",
        )}
      />
    </RadixSwitch.Root>
  );
}
