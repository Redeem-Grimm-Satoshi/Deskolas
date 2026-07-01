import { redirect } from "next/navigation";

import { PeopleTable } from "@/components/app/people-table";
import {
  getSessionProfile,
  listPendingInvites,
  listProfiles,
} from "@/lib/queries";

// Admin-only oversight of the cohort roster and invites.
export default async function PeoplePage() {
  const profile = await getSessionProfile();
  if (!profile) redirect("/sign-in");
  if (profile.role !== "admin") redirect("/my-tickets");

  const [profiles, invites] = await Promise.all([
    listProfiles(),
    listPendingInvites(),
  ]);

  return (
    <PeopleTable
      profiles={profiles}
      invites={invites}
      currentUserId={profile.id}
    />
  );
}
