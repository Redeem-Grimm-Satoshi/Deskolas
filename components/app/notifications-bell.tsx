"use client";

import * as Popover from "@radix-ui/react-popover";
import { Bell } from "lucide-react";

import { Button } from "@/components/ui/button";

// Placeholder until a notifications source lands. The panel keeps its place in
// the chrome and reads as "nothing waiting" rather than showing mock data.
export function NotificationsBell() {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button variant="ghost" iconOnly aria-label="Notifications">
          <Bell className="size-[18px]" strokeWidth={1.5} />
        </Button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="end"
          sideOffset={8}
          className="rounded-card border-border bg-surface shadow-floating z-50 w-[360px] overflow-hidden border motion-safe:data-[state=open]:animate-[layer-in_180ms_ease-out]"
        >
          <div className="border-border border-b px-4 py-3">
            <span className="text-text text-[14px] font-semibold">
              Notifications
            </span>
          </div>
          <p className="text-text-2 px-4 py-8 text-center text-[13px]">
            You are all caught up.
          </p>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
