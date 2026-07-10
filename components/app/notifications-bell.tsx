"use client";

import * as Popover from "@radix-ui/react-popover";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { Bell } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { markAllNotificationsRead } from "@/app/(app)/actions";
import { useSession } from "@/components/providers/session-provider";
import { Button } from "@/components/ui/button";
import { NotificationItem } from "@/components/ui/notification-item";
import { dateTimeLabel, relativeTime } from "@/lib/format";
import { createClient } from "@/lib/supabase/client";

type NotificationRow = {
  id: string;
  body: string;
  reference: string | null;
  read: boolean;
  created_at: string;
};

// Renders the body with any PS-#### reference as an accent link to the ticket.
function withTicketLink(body: string, reference: string | null) {
  if (!reference || !body.includes(reference)) return body;
  return body.split(reference).reduce<React.ReactNode[]>((parts, chunk, i) => {
    if (i > 0) {
      parts.push(
        <Link
          key={i}
          href={`/tickets/${reference}`}
          className="text-accent-text font-mono"
        >
          {reference}
        </Link>,
      );
    }
    parts.push(chunk);
    return parts;
  }, []);
}

export function NotificationsBell() {
  const { user } = useSession();
  const [rows, setRows] = React.useState<NotificationRow[]>([]);

  React.useEffect(() => {
    const supabase = createClient();
    let channel: RealtimeChannel | null = null;
    let active = true;

    (async () => {
      const { data: initial } = await supabase
        .from("notifications")
        .select("id, body, reference, read, created_at")
        .order("created_at", { ascending: false })
        .limit(30);
      if (!active) return;
      if (initial) setRows(initial);

      // The user token must be on the socket before the channel joins: the
      // postgres_changes subscription binds its RLS claims at join, and an
      // anonymous join would deliver nothing.
      const { data } = await supabase.auth.getSession();
      if (!active) return;
      supabase.realtime.setAuth(data.session?.access_token ?? "");

      channel = supabase
        .channel(`notifications:${user.id}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "notifications",
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            setRows((prev) =>
              [payload.new as NotificationRow, ...prev].slice(0, 30),
            );
          },
        )
        .subscribe();
    })();

    return () => {
      active = false;
      if (channel) supabase.removeChannel(channel);
    };
  }, [user.id]);

  const hasUnread = rows.some((row) => !row.read);

  async function markAllRead() {
    setRows((prev) => prev.map((row) => ({ ...row, read: true })));
    await markAllNotificationsRead();
  }

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
            {hasUnread ? (
              <button
                type="button"
                onClick={markAllRead}
                className="text-accent-text text-[12px] font-medium"
              >
                Mark all read
              </button>
            ) : null}
          </div>
          {rows.length > 0 ? (
            <div className="max-h-[360px] overflow-y-auto">
              {rows.map((row, index) => (
                <div
                  key={row.id}
                  className={index > 0 ? "border-border border-t" : undefined}
                >
                  <NotificationItem
                    read={row.read}
                    timeLabel={relativeTime(row.created_at)}
                    timeTitle={dateTimeLabel(row.created_at)}
                    message={withTicketLink(row.body, row.reference)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-text-2 px-4 py-8 text-center text-[13px]">
              You are all caught up.
            </p>
          )}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
