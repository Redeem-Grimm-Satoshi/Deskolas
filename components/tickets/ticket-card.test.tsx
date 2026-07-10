import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { TicketCard } from "./ticket-card";

const base = {
  id: "PS-0003",
  title: "VS Code can't find my Python interpreter",
  priority: "medium" as const,
  category: "Software and IDE",
  updatedLabel: "1h ago",
  updatedTitle: "Jul 9, 06:40 PM",
  href: "/tickets/ps-0003",
};

describe("TicketCard", () => {
  it("shows the id, title, status label, and links to the ticket", () => {
    render(
      <TicketCard
        {...base}
        status="in_progress"
        assignee={{ name: "Andre T." }}
      />,
    );

    expect(screen.getByText("PS-0003")).toBeInTheDocument();
    expect(screen.getByText(base.title)).toBeInTheDocument();
    expect(screen.getByText("In progress")).toBeInTheDocument();
    expect(screen.getByText("Andre T.")).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "/tickets/ps-0003",
    );
  });

  it("reads as unassigned when there is no assignee", () => {
    render(<TicketCard {...base} status="new" />);
    expect(screen.getByText("Unassigned")).toBeInTheDocument();
  });

  it("renders the closed status", () => {
    render(<TicketCard {...base} status="closed" />);
    expect(screen.getByText("Closed")).toBeInTheDocument();
  });
});
