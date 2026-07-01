"use client";

import * as React from "react";

import type { Role, SessionProfile } from "@/lib/tickets";

// Holds the signed-in user's profile for client components (the sidebar, the
// top bar, menus). The value is fetched on the server and passed down, so this
// is just context, no fetching.
type SessionValue = { user: SessionProfile; role: Role };

const SessionContext = React.createContext<SessionValue | null>(null);

export function SessionProvider({
  profile,
  children,
}: {
  profile: SessionProfile;
  children: React.ReactNode;
}) {
  const value = React.useMemo(
    () => ({ user: profile, role: profile.role }),
    [profile],
  );
  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = React.useContext(SessionContext);
  if (!ctx) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return ctx;
}
