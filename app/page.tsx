import { redirect } from "next/navigation";

import { getSessionProfile } from "@/lib/queries";

// The entry point routes by role: admins land on the dashboard, members on
// their own tickets. Unauthenticated users are sent to sign in.
export default async function Home() {
  const profile = await getSessionProfile();
  if (!profile) redirect("/sign-in");
  redirect(profile.role === "admin" ? "/dashboard" : "/my-tickets");
}
