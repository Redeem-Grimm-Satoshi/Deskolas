"use client";

import * as RadixCheckbox from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";

import { focusRing } from "@/lib/styles";
import { cn } from "@/lib/utils";

type CheckboxProps = {
  id?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
  "aria-label"?: string;
};

export function Checkbox({
  onCheckedChange,
  className,
  ...props
}: CheckboxProps) {
  return (
    <RadixCheckbox.Root
      onCheckedChange={(value) => onCheckedChange?.(value === true)}
      // A checkbox is too small for the 8px control radius; 4px keeps the
      // square reading concentric with the inner check.
      className={cn(
        "border-border-strong bg-bg flex size-[18px] shrink-0 items-center justify-center rounded-[4px] border transition-colors",
        "data-[state=checked]:border-accent data-[state=checked]:bg-accent",
        focusRing,
        className,
      )}
      {...props}
    >
      <RadixCheckbox.Indicator>
        <Check className="size-3.5 text-white" strokeWidth={2.5} />
      </RadixCheckbox.Indicator>
    </RadixCheckbox.Root>
  );
}
