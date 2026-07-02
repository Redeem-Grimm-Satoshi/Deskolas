"use client";

import type { RealtimeChannel } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import * as React from "react";

import { createClient } from "@/lib/supabase/client";

// Re-renders the current route's server components whenever a ticket or
// comment changes anywhere, so lists, the dashboard, and open detail pages
// stay current without a manual refresh. Bursts (a claim updates assignment
// and status together) collapse into one refresh.
export function LiveRefresh() {
  const router = useRouter();

  React.useEffect(() => {
    const supabase = createClient();
    let timeout: ReturnType<typeof setTimeout> | undefined;
    let channel: RealtimeChannel | null = null;
    let cancelled = false;

    const refresh = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => router.refresh(), 400);
    };

    // The user token must be on the socket before the channel joins: the
    // postgres_changes subscription binds its RLS claims at join, and an
    // anonymous join would deliver nothing.
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (cancelled) return;
      supabase.realtime.setAuth(data.session?.access_token ?? "");

      channel = supabase
        .channel("live-updates")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "tickets" },
          refresh,
        )
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "comments" },
          refresh,
        )
        .subscribe();
    })();

    return () => {
      cancelled = true;
      clearTimeout(timeout);
      if (channel) supabase.removeChannel(channel);
    };
  }, [router]);

  return null;
}
