"use client";

import { SessionProvider } from "@/components/providers/session-provider";
import { Sidebar } from "./sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <div className="bg-bg flex min-h-dvh">
        <aside className="sticky top-0 hidden h-dvh shrink-0 lg:flex">
          <Sidebar />
        </aside>
        <div className="flex min-w-0 flex-1 flex-col">{children}</div>
      </div>
    </SessionProvider>
  );
}
