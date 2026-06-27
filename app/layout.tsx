import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";

import { ThemeProvider } from "@/components/providers/theme-provider";
import { ToastProvider } from "@/components/ui/toast";

import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Deskolas",
  description: "The cohort help desk.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Dark is the default theme; a `light` class on <html> swaps the token layer.
  // suppressHydrationWarning lets next-themes set that class before paint.
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetBrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh">
        <ThemeProvider>
          <ToastProvider>{children}</ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
