import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My tickets",
};

export default function MyticketsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
