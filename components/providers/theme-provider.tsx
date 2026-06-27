"use client";

import { ThemeProvider as NextThemeProvider } from "next-themes";

// Dark is the default. next-themes toggles a `light` class on <html>, which is
// exactly what the token layer in globals.css overrides on.
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      themes={["dark", "light"]}
      disableTransitionOnChange
    >
      {children}
    </NextThemeProvider>
  );
}
