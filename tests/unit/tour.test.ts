import { beforeEach, describe, expect, it } from "vitest";

import {
  markSeen,
  readTourRecord,
  stepsForRole,
  TOUR_STEPS,
  unseenSteps,
  writeTourRecord,
  type TourStep,
} from "@/lib/tour";

const steps: TourStep[] = [
  { id: "a", target: "a", title: "A", body: "a" },
  { id: "b", target: "b", title: "B", body: "b", roles: ["admin"] },
  { id: "c", target: "c", title: "C", body: "c" },
];

describe("tour registry", () => {
  it("has unique step ids and copy on every step", () => {
    const ids = TOUR_STEPS.map((step) => step.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const step of TOUR_STEPS) {
      expect(step.title.length).toBeGreaterThan(0);
      expect(step.body.length).toBeGreaterThan(0);
    }
  });

  it("filters steps by role", () => {
    expect(stepsForRole("member", steps).map((s) => s.id)).toEqual(["a", "c"]);
    expect(stepsForRole("admin", steps).map((s) => s.id)).toEqual([
      "a",
      "b",
      "c",
    ]);
  });

  it("reports only the steps not yet seen", () => {
    expect(unseenSteps(steps, null)).toHaveLength(3);
    expect(unseenSteps(steps, { seen: ["a", "c"] }).map((s) => s.id)).toEqual([
      "b",
    ]);
  });

  it("marks steps seen without duplicates and keeps extra fields", () => {
    const record = markSeen({ seen: ["a"] }, ["a", "b"], {
      skippedAt: "2026-11-15T00:00:00.000Z",
    });
    expect(record.seen).toEqual(["a", "b"]);
    expect(record.skippedAt).toBe("2026-11-15T00:00:00.000Z");
  });
});

describe("tour storage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("round-trips a record per user", () => {
    expect(readTourRecord("u1")).toBeNull();
    writeTourRecord("u1", { seen: ["a"] });
    expect(readTourRecord("u1")).toEqual({ seen: ["a"] });
    expect(readTourRecord("u2")).toBeNull();
  });

  it("ignores malformed storage", () => {
    window.localStorage.setItem("deskolas:tour:u1", "{not json");
    expect(readTourRecord("u1")).toBeNull();
    window.localStorage.setItem("deskolas:tour:u1", JSON.stringify({ x: 1 }));
    expect(readTourRecord("u1")).toBeNull();
  });
});
