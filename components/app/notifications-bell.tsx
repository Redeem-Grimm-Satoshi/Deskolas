"use client";

import * as Popover from "@radix-ui/react-popover";
import { Bell } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { NotificationItem } from "@/components/ui/notification-item";
import { NOTIFICATIONS } from "@/lib/mock-data";

// Style any PS-#### reference inside the message as a mono accent token.
function withTicketRefs(text: string) {
  return text.split(/(PS-\d{4})/g).map((part, index) =>
    /^PS-\d{4}$/.test(part) ? (
      <span key={index} className="text-accent-text font-mono">
        {part}
      </span>
    ) : (
      <React.Fragment key={index}>{part}</React.Fragment>
    ),
  );
}

export function NotificationsBell() {
  const hasUnread = NOTIFICATIONS.some((item) => !item.read);

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button
          variant="ghost"
          iconOnly
          aria-label="Notifications"
          className="relative"
        >
          <Bell className="size-[18px]" strokeWidth={1.5} />
          {hasUnread ? (
            <span className="bg-accent ring-bg absolute top-2 right-2 size-2 rounded-full ring-2" />
          ) : null}
        </Button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="end"
          sideOffset={8}
          className="rounded-card border-border bg-surface shadow-floating z-50 w-[360px] overflow-hidden border motion-safe:data-[state=open]:animate-[layer-in_180ms_ease-out]"
        >
          <div className="border-border flex items-center justify-between border-b px-4 py-3">
            <span className="text-text text-[14px] font-semibold">
              Notifications
            </span>
            <button
              type="button"
              className="text-accent-text text-[12px] font-medium"
            >
              Mark all read
            </button>
          </div>
          <div className="max-h-[360px] overflow-y-auto">
            {NOTIFICATIONS.map((item, index) => (
              <div
                key={item.id}
                className={index > 0 ? "border-border border-t" : undefined}
              >
                <NotificationItem
                  read={item.read}
                  timeLabel={item.timeLabel}
                  message={withTicketRefs(item.body)}
                />
              </div>
            ))}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
