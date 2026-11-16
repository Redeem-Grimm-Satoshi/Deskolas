"use client";

import { SessionProvider } from "@/components/providers/session-provider";
import { TourProvider } from "@/components/tour/tour-provider";
import type { SessionProfile } from "@/lib/tickets";
import { LiveRefresh } from "./live-refresh";
import { Sidebar } from "./sidebar";

export function AppShell({
  profile,
  children,
}: {
  profile: SessionProfile;
  children: React.ReactNode;
}) {
  return (
    <SessionProvider profile={profile}>
      <LiveRefresh />
      <TourProvider>
        <div className="bg-bg flex min-h-dvh">
          <a
            href="#content"
            className="rounded-control border-border bg-surface text-text focus-ring sr-only border px-3.5 py-2 text-[14px] font-medium focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50"
          >
            Skip to content
          </a>

          <aside className="sticky top-0 hidden h-dvh shrink-0 lg:flex">
            <Sidebar />
          </aside>

          <main
            id="content"
            tabIndex={-1}
            className="flex min-w-0 flex-1 flex-col"
          >
            {children}
          </main>
        </div>
      </TourProvider>
    </SessionProvider>
  );
}
