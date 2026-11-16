"use client";

import * as React from "react";

import { useSession } from "@/components/providers/session-provider";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import {
  markSeen,
  parseTourRecord,
  readTourRaw,
  stepsForRole,
  unseenSteps,
  writeTourRecord,
  type TourRecord,
  type TourStep,
} from "@/lib/tour";
import { TourOverlay } from "./tour-overlay";

type Mode = "full" | "new";

type TourContextValue = {
  start: (mode?: Mode) => void;
  /** True when steps were added since this person last took the tour. */
  hasNewSteps: boolean;
  newCount: number;
  active: boolean;
};

const TourContext = React.createContext<TourContextValue | null>(null);

export function useTour() {
  const ctx = React.useContext(TourContext);
  if (!ctx) throw new Error("useTour must be used within a TourProvider");
  return ctx;
}

// localStorage as an external store: the server snapshot is "not loaded", so
// the first client render matches the server and the record arrives right
// after hydration without a mount effect.
const listeners = new Set<() => void>();
function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
function notify() {
  for (const listener of listeners) listener();
}
const NOT_LOADED = "__not_loaded__";

// Owns the first-run welcome prompt, the per-user "seen" record, and the
// running tour. First visit: the welcome dialog offers the tour or a skip.
// Later visits: nothing pops up, but the sidebar launcher stays visible and
// turns into "What's new" when the registry has steps this person has not
// seen, so a feature added later gets its own short tour.
export function TourProvider({ children }: { children: React.ReactNode }) {
  const { user, role } = useSession();
  const steps = React.useMemo(() => stepsForRole(role), [role]);

  const raw = React.useSyncExternalStore(
    subscribe,
    () => readTourRaw(user.id),
    () => NOT_LOADED,
  );
  const loaded = raw !== NOT_LOADED;
  const record = React.useMemo(
    () => (loaded ? parseTourRecord(raw) : null),
    [loaded, raw],
  );

  const [run, setRun] = React.useState<{
    steps: TourStep[];
    label: string;
  } | null>(null);
  const [index, setIndex] = React.useState(0);

  const persist = React.useCallback(
    (next: TourRecord) => {
      writeTourRecord(user.id, next);
      notify();
    },
    [user.id],
  );

  const unseen = React.useMemo(
    () => (loaded ? unseenSteps(steps, record) : []),
    [loaded, steps, record],
  );
  const hasNewSteps =
    record !== null && unseen.length > 0 && unseen.length < steps.length;
  const welcomeOpen = loaded && record === null && run === null;

  const start = React.useCallback(
    (mode: Mode = "full") => {
      const list = mode === "new" ? unseen : steps;
      if (list.length === 0) return;
      setRun({
        steps: list,
        label: mode === "new" ? "New in Deskolas" : "Tour",
      });
      setIndex(0);
    },
    [steps, unseen],
  );

  const end = React.useCallback(() => {
    if (run) {
      persist(
        markSeen(
          record,
          run.steps.map((step) => step.id),
        ),
      );
    }
    setRun(null);
  }, [run, record, persist]);

  function skipWelcome() {
    persist(
      markSeen(
        record,
        steps.map((step) => step.id),
        { skippedAt: new Date().toISOString() },
      ),
    );
  }

  const value = React.useMemo<TourContextValue>(
    () => ({
      start,
      hasNewSteps,
      newCount: unseen.length,
      active: run !== null,
    }),
    [start, hasNewSteps, unseen.length, run],
  );

  return (
    <TourContext.Provider value={value}>
      {children}
      <Dialog
        open={welcomeOpen}
        onOpenChange={(open) => {
          if (!open) skipWelcome();
        }}
        title="Welcome to Deskolas"
        description="Stuck? Deskolas it. This is where the cohort opens tickets, picks them up, and resolves them together."
        footer={
          <>
            <Button variant="secondary" onClick={skipWelcome}>
              Skip for now
            </Button>
            <Button onClick={() => start("full")}>Take the tour</Button>
          </>
        }
      >
        <p className="text-text-2 text-[14px] leading-5">
          A two minute walk through the queue, opening a ticket, and where
          everything lives. You can replay it any time from the sidebar.
        </p>
      </Dialog>
      {run ? (
        <TourOverlay
          steps={run.steps}
          index={index}
          label={run.label}
          onIndexChange={setIndex}
          onEnd={end}
        />
      ) : null}
    </TourContext.Provider>
  );
}
