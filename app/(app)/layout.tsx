import { redirect } from "next/navigation";

import { AppShell } from "@/components/app/app-shell";
import { getSessionProfile } from "@/lib/queries";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getSessionProfile();
  if (!profile) redirect("/sign-in");
  return <AppShell profile={profile}>{children}</AppShell>;
}
