"use client";

import { Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";

import { addInvite, updateMemberRole } from "@/app/(app)/actions";
import { AppTopBar } from "@/components/app/app-top-bar";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useToast } from "@/components/ui/toast";
import { joinedLabel, relativeTime } from "@/lib/format";
import type { InviteView, PersonView } from "@/lib/queries";
import { ROLE_LABELS } from "@/lib/tickets";

const roleOptions = [
  { value: "member", label: "Member" },
  { value: "admin", label: "Admin" },
];

export function PeopleTable({
  profiles,
  invites,
  currentUserId,
}: {
  profiles: PersonView[];
  invites: InviteView[];
  currentUserId: string;
}) {
  const toast = useToast();
  const router = useRouter();
  const [invite, setInvite] = React.useState("");
  const [inviteRole, setInviteRole] = React.useState("member");
  const [sending, setSending] = React.useState(false);

  async function submitInvite() {
    if (!invite.trim()) return;
    setSending(true);
    const result = await addInvite(invite, inviteRole);
    setSending(false);
    if (result.error) {
      toast({ message: result.error });
      return;
    }
    toast({ message: `${invite.trim()} added to the invite list` });
    setInvite("");
    router.refresh();
  }

  async function changeRole(userId: string, role: string) {
    const result = await updateMemberRole(userId, role);
    toast({ message: result.error ?? "Role updated" });
    router.refresh();
  }

  return (
    <>
      <AppTopBar title="People" />
      <div className="flex flex-col gap-6 p-6 max-sm:p-4">
        <section className="rounded-card border-border bg-surface border p-5">
          <h2 className="text-text text-[14px] font-semibold">
            Invite a cohort member
          </h2>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Input
              className="min-w-0"
              type="email"
              placeholder="name@cohort.dev"
              aria-label="Invite email"
              value={invite}
              onChange={(event) => setInvite(event.target.value)}
            />
            <Select
              options={roleOptions}
              value={inviteRole}
              onValueChange={setInviteRole}
              className="w-36"
              aria-label="Invite role"
            />
            <Button onClick={submitInvite} loading={sending}>
              Add to invite list
            </Button>
          </div>
          <p className="text-text-muted mt-2.5 text-[12px]">
            Invite anyone in Per Scholas by email, then tell them to sign up
            with it (password or Google). No email is sent. Admin is granted
            here, never chosen at sign-up.
          </p>
        </section>

        <section className="rounded-card border-border bg-surface border">
          <div className="border-border flex items-center justify-between border-b px-5 py-3">
            <h2 className="text-text text-[14px] font-semibold">Members</h2>
            <span className="text-text-muted text-[12px]">
              {profiles.length} members · {invites.length} pending
            </span>
          </div>

          <div className="text-text-muted grid grid-cols-[1fr_auto_auto] items-center gap-x-4 px-5 py-2 text-[11px] font-medium tracking-[0.06em] uppercase">
            <span>Member</span>
            <span className="w-28">Role</span>
            <span className="w-16">Joined</span>
          </div>

          {profiles.map((member) => {
            const isYou = member.id === currentUserId;
            return (
              <div
                key={member.id}
                className="border-border grid grid-cols-[1fr_auto_auto] items-center gap-x-4 border-t px-5 py-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <Avatar
                    name={member.fullName}
                    src={member.avatarUrl}
                    size={32}
                  />
                  <div className="min-w-0">
                    <p className="text-text truncate text-[14px] font-medium">
                      {member.fullName}
                      {isYou ? (
                        <span className="text-text-muted"> · you</span>
                      ) : null}
                    </p>
                    <p className="text-text-muted truncate font-mono text-[12px]">
                      {member.email}
                    </p>
                  </div>
                </div>
                <div className="w-28">
                  {isYou ? (
                    <span className="bg-accent-tint text-accent-text inline-flex items-center rounded-full px-2.5 py-[3px] text-[12px] font-medium">
                      {ROLE_LABELS[member.role]}
                    </span>
                  ) : (
                    <Select
                      options={roleOptions}
                      value={member.role}
                      onValueChange={(value) => changeRole(member.id, value)}
                      className="w-full"
                      aria-label={`Role for ${member.fullName}`}
                    />
                  )}
                </div>
                <span className="text-text-2 w-16 text-[13px]">
                  {joinedLabel(member.joinedAt)}
                </span>
              </div>
            );
          })}

          {invites.map((pending) => (
            <div
              key={pending.email}
              className="border-border grid grid-cols-[1fr_auto_auto] items-center gap-x-4 border-t px-5 py-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="bg-hover-surface flex size-8 items-center justify-center rounded-full">
                  <Mail className="text-text-muted size-4" strokeWidth={1.5} />
                </span>
                <div className="min-w-0">
                  <p className="text-text truncate font-mono text-[13px]">
                    {pending.email}
                  </p>
                  <p className="text-text-muted text-[12px]">
                    Invited {relativeTime(pending.invitedAt)}
                  </p>
                </div>
              </div>
              <div className="w-28">
                <span className="bg-pill-new-bg text-pill-new-text inline-flex items-center rounded-full px-2.5 py-[3px] text-[12px] font-medium">
                  Pending
                </span>
              </div>
              <span className="w-16" />
            </div>
          ))}
        </section>
      </div>
    </>
  );
}
