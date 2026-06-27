import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Button } from "./button";

describe("Button", () => {
  it("renders its label", () => {
    render(<Button>Open a ticket</Button>);
    expect(
      screen.getByRole("button", { name: "Open a ticket" }),
    ).toBeInTheDocument();
  });

  it("is disabled and swaps to the loading label while loading", () => {
    render(
      <Button loading loadingText="Opening ticket">
        Open ticket
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Opening ticket" });
    expect(button).toBeDisabled();
  });
});
