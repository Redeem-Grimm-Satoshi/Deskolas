"use client";

import * as RadixDialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import * as React from "react";

import { focusRing } from "@/lib/styles";
import { cn } from "@/lib/utils";

type DialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
};

export function Dialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  className,
}: DialogProps) {
  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay
          className={cn(
            "fixed inset-0 z-50 bg-[var(--scrim)]",
            "motion-safe:data-[state=open]:animate-[scrim-in_200ms_ease-out]",
          )}
        />
        <RadixDialog.Content
          className={cn(
            "fixed top-1/2 left-1/2 z-50 flex w-full max-w-[440px] -translate-x-1/2 -translate-y-1/2 flex-col gap-4",
            "rounded-card border-border bg-surface shadow-floating border p-6",
            "motion-safe:data-[state=open]:animate-[layer-in_220ms_ease-out]",
            "max-sm:top-0 max-sm:h-dvh max-sm:max-w-none max-sm:-translate-x-1/2 max-sm:-translate-y-0 max-sm:rounded-none",
            className,
          )}
        >
          <div className="flex items-start justify-between gap-4">
            <RadixDialog.Title className="text-heading text-text font-semibold">
              {title}
            </RadixDialog.Title>
            <RadixDialog.Close
              className={cn(
                "rounded-control text-text-muted hover:text-text -m-1 p-1 transition-colors",
                focusRing,
              )}
              aria-label="Close"
            >
              <X className="size-[18px]" strokeWidth={1.5} />
            </RadixDialog.Close>
          </div>

          {description ? (
            <RadixDialog.Description className="text-text-2 text-[14px] leading-5">
              {description}
            </RadixDialog.Description>
          ) : null}

          {children}

          {footer ? (
            <div className="mt-2 flex justify-end gap-2 max-sm:mt-auto">
              {footer}
            </div>
          ) : null}
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}
