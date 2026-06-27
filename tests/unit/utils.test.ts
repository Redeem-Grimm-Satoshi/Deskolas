import { describe, expect, it } from "vitest";

import { cn } from "@/lib/utils";

describe("cn", () => {
  it("keeps the last of conflicting Tailwind utilities", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });

  it("drops falsey class names", () => {
    expect(cn("text-text", false, undefined, "font-medium")).toBe(
      "text-text font-medium",
    );
  });
});
