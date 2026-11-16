import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { SessionProvider } from "@/components/providers/session-provider";
import { readTourRecord, TOUR_STEPS } from "@/lib/tour";

import { TourLauncher } from "./tour-launcher";
import { TourProvider } from "./tour-provider";

const push = vi.fn();
const router = { push };
vi.mock("next/navigation", () => ({
  useRouter: () => router,
  usePathname: () => "/tickets",
}));

// jsdom lays nothing out, so anchors report a real box by hand and the
// overlay's measurement helpers are stubbed.
Element.prototype.scrollIntoView = vi.fn();
window.matchMedia = vi.fn().mockReturnValue({ matches: true });

const profile = {
  id: "user-1",
  fullName: "Andre T.",
  email: "andre@example.com",
  role: "member" as const,
  avatarUrl: null,
};

function Anchor({ id }: { id: string }) {
  return (
    <button
      type="button"
      data-tour={id}
      ref={(node) => {
        if (node) {
          node.getBoundingClientRect = () =>
            ({ top: 10, left: 10, width: 100, height: 36 }) as DOMRect;
        }
      }}
    >
      {id}
    </button>
  );
}

function renderApp() {
  return render(
    <SessionProvider profile={profile}>
      <TourProvider>
        {TOUR_STEPS.filter(
          (step) => !step.roles && step.target !== "queue-filters",
        ).map((step) => (
          <Anchor key={step.id} id={step.target} />
        ))}
        <TourLauncher />
      </TourProvider>
    </SessionProvider>,
  );
}

describe("TourProvider", () => {
  beforeEach(() => {
    window.localStorage.clear();
    push.mockClear();
  });

  it("offers the tour on first visit and remembers a skip", async () => {
    const user = userEvent.setup();
    renderApp();

    expect(
      await screen.findByRole("dialog", { name: "Welcome to Deskolas" }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Skip for now" }));
    expect(
      screen.queryByRole("dialog", { name: "Welcome to Deskolas" }),
    ).not.toBeInTheDocument();

    const record = readTourRecord("user-1");
    expect(record?.skippedAt).toBeTruthy();
    expect(record?.seen.length).toBeGreaterThan(0);
    // The launcher stays visible for a replay.
    expect(
      screen.getByRole("button", { name: "Take the tour" }),
    ).toBeInTheDocument();
  });

  it("walks through the steps whose anchors exist and skips the rest", async () => {
    const user = userEvent.setup();
    renderApp();

    await user.click(
      await screen.findByRole("button", { name: "Take the tour" }),
    );

    expect(
      await screen.findByRole("dialog", { name: "The queue" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Skip tour")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(
      await screen.findByRole("dialog", { name: "Stuck? Deskolas it." }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Back" }));
    expect(
      await screen.findByRole("dialog", { name: "The queue" }),
    ).toBeInTheDocument();

    // "Narrow the queue" has no anchor in this tree: after the retry budget
    // the overlay skips it and lands on the step after.
    await user.click(screen.getByRole("button", { name: "Next" }));
    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(
      await screen.findByRole(
        "dialog",
        { name: "Read a ticket at a glance" },
        { timeout: 10_000 },
      ),
    ).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    const seen = readTourRecord("user-1")?.seen ?? [];
    for (const step of TOUR_STEPS.filter((s) => !s.roles)) {
      expect(seen).toContain(step.id);
    }
  }, 20_000);

  it("surfaces unseen steps as What's new for returning users", async () => {
    const seenAllButOne = TOUR_STEPS.filter((s) => !s.roles)
      .map((s) => s.id)
      .filter((id) => id !== "new-ticket");
    window.localStorage.setItem(
      "deskolas:tour:user-1",
      JSON.stringify({ seen: seenAllButOne }),
    );
    const user = userEvent.setup();
    renderApp();

    expect(
      screen.queryByRole("dialog", { name: "Welcome to Deskolas" }),
    ).not.toBeInTheDocument();
    const launcher = await screen.findByRole("button", {
      name: /What's new/,
    });
    expect(launcher).toHaveTextContent("1");

    await user.click(launcher);
    expect(
      await screen.findByRole("dialog", { name: "Stuck? Deskolas it." }),
    ).toBeInTheDocument();
    expect(screen.getByText("1 / 1")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Done" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(readTourRecord("user-1")?.seen).toContain("new-ticket");
  });
});
