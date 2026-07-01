"use client";

import { SessionProvider } from "@/components/providers/session-provider";
import type { SessionProfile } from "@/lib/tickets";
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
      <div className="bg-bg flex min-h-dvh">
        <aside className="sticky top-0 hidden h-dvh shrink-0 lg:flex">
          <Sidebar />
        </aside>
        <div className="flex min-w-0 flex-1 flex-col">{children}</div>
      </div>
    </SessionProvider>
  );
}
