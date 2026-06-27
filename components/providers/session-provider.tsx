"use client";

import * as React from "react";

import { PROFILES, type Profile, type Role } from "@/lib/mock-data";

// Mock session for the UI preview. Phase 2 replaces this with the real Supabase
// user and role read on the server. The "view as" switch lets you preview both
// the admin and learner experiences without real auth.
type SessionValue = {
  user: Profile;
  role: Role;
  viewAs: (role: Role) => void;
};

const SessionContext = React.createContext<SessionValue | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = React.useState("andre");
  const user = PROFILES[userId];

  const viewAs = React.useCallback((role: Role) => {
    setUserId(role === "admin" ? "andre" : "redeem");
  }, []);

  return (
    <SessionContext.Provider value={{ user, role: user.role, viewAs }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = React.useContext(SessionContext);
  if (!ctx) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return ctx;
}
