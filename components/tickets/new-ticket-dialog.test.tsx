import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { SessionProvider } from "@/components/providers/session-provider";
import { ToastProvider } from "@/components/ui/toast";

import { NewTicketButton } from "./new-ticket-dialog";

const createTicket = vi.fn();

// Radix Select relies on DOM APIs that jsdom does not implement.
Element.prototype.scrollIntoView = vi.fn();
Element.prototype.hasPointerCapture = vi.fn(() => false);
Element.prototype.releasePointerCapture = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: vi.fn() }),
}));

vi.mock("@/app/(app)/actions", () => ({
  createTicket: (...args: unknown[]) => createTicket(...args),
}));

const profile = {
  id: "user-1",
  fullName: "Andre T.",
  email: "andre@example.com",
  role: "member" as const,
  avatarUrl: null,
};

function renderButton() {
  return render(
    <SessionProvider profile={profile}>
      <ToastProvider>
        <NewTicketButton />
      </ToastProvider>
    </SessionProvider>,
  );
}

describe("NewTicketButton", () => {
  it("keeps the typed draft when the dialog is closed and reopened", async () => {
    const user = userEvent.setup();
    renderButton();

    await user.click(screen.getByRole("button", { name: "New ticket" }));
    await user.type(screen.getByLabelText("Title"), "Zoom mic not working");
    await user.type(
      screen.getByLabelText("Description"),
      "No input in Zoom during class.",
    );

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "New ticket" }));
    expect(screen.getByLabelText("Title")).toHaveValue("Zoom mic not working");
    expect(screen.getByLabelText("Description")).toHaveValue(
      "No input in Zoom during class.",
    );
  });

  it("clears the draft after a successful submit", async () => {
    createTicket.mockResolvedValueOnce({ reference: "PS-0042" });
    const user = userEvent.setup();
    renderButton();

    await user.click(screen.getByRole("button", { name: "New ticket" }));
    await user.type(screen.getByLabelText("Title"), "Projector flickers");
    await user.type(
      screen.getByLabelText("Description"),
      "The classroom projector flickers every few minutes.",
    );
    const category = screen.getByLabelText("Category");
    category.focus();
    await user.keyboard("{Enter}");
    await user.click(
      await screen.findByRole("option", { name: "Hardware and AV" }),
    );

    await user.click(screen.getByRole("button", { name: "Open ticket" }));
    expect(createTicket).toHaveBeenCalledWith({
      title: "Projector flickers",
      description: "The classroom projector flickers every few minutes.",
      category: "Hardware and AV",
      priority: "low",
    });
    expect(
      await screen.findByText("Ticket PS-0042 submitted"),
    ).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "New ticket" }));
    expect(screen.getByLabelText("Title")).toHaveValue("");
    expect(screen.getByLabelText("Description")).toHaveValue("");
  });
});
