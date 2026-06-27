"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

// The visible icon is driven by the `light` class on <html>, which next-themes
// sets before paint. That keeps server and client markup identical (no mounted
// flag, no hydration mismatch) while CSS picks the right glyph per theme.
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Button
      variant="secondary"
      iconOnly
      aria-label="Toggle theme"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      <Moon className="light:hidden size-4" strokeWidth={1.5} />
      <Sun className="light:block hidden size-4" strokeWidth={1.5} />
    </Button>
  );
}
