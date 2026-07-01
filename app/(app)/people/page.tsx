"use client";

import { Mail, MoreVertical } from "lucide-react";
import * as React from "react";

import { AppTopBar } from "@/components/app/app-top-bar";
import { useSession } from "@/components/providers/session-provider";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useToast } from "@/components/ui/toast";
import { PENDING_INVITES, PROFILES } from "@/lib/mock-data";

const roleOptions = [
  { value: "learner", label: "Learner" },
  { value: "admin", label: "Admin" },
];

export default function PeoplePage() {
  const { user } = useSession();
  const toast = useToast();
  const [invite, setInvite] = React.useState("");
  const members = Object.values(PROFILES);

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
              placeholder="name@cohort.dev"
              aria-label="Invite email"
              value={invite}
              onChange={(event) => setInvite(event.target.value)}
            />
            <Select
              options={roleOptions}
              defaultValue="learner"
              className="w-36"
              aria-label="Invite role"
            />
            <Button
              onClick={() => {
                toast({ message: "Invite sent" });
                setInvite("");
              }}
            >
              Send invite
            </Button>
          </div>
          <p className="text-text-muted mt-2.5 text-[12px]">
            Invite anyone in Per Scholas by email. Admin is granted here, never
            chosen at sign-up.
          </p>
        </section>

        <section className="rounded-card border-border bg-surface border">
          <div className="border-border flex items-center justify-between border-b px-5 py-3">
            <h2 className="text-text text-[14px] font-semibold">Members</h2>
            <span className="text-text-muted text-[12px]">
              {members.length} members · {PENDING_INVITES.length} pending
            </span>
          </div>

          <div className="text-text-muted grid grid-cols-[1fr_auto_auto_auto] items-center gap-x-4 px-5 py-2 text-[11px] font-medium tracking-[0.06em] uppercase">
            <span>Member</span>
            <span className="w-28">Role</span>
            <span className="w-16">Joined</span>
            <span className="w-6" />
          </div>

          {members.map((member) => {
            const isYou = member.id === user.id;
            return (
              <div
                key={member.id}
                className="border-border grid grid-cols-[1fr_auto_auto_auto] items-center gap-x-4 border-t px-5 py-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <Avatar name={member.fullName} size={32} />
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
                      Admin
                    </span>
                  ) : (
                    <Select
                      options={roleOptions}
                      defaultValue={member.role}
                      className="w-full"
                      aria-label={`Role for ${member.fullName}`}
                    />
                  )}
                </div>
                <span className="text-text-2 w-16 text-[13px]">
                  {member.joinedLabel}
                </span>
                <Button
                  variant="ghost"
                  iconOnly
                  aria-label={`Manage ${member.fullName}`}
                  className="w-6"
                >
                  <MoreVertical className="size-4" strokeWidth={1.5} />
                </Button>
              </div>
            );
          })}

          {PENDING_INVITES.map((pending) => (
            <div
              key={pending.email}
              className="border-border grid grid-cols-[1fr_auto_auto_auto] items-center gap-x-4 border-t px-5 py-3"
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
                    {pending.invitedLabel}
                  </p>
                </div>
              </div>
              <div className="w-28">
                <span className="bg-pill-new-bg text-pill-new-text inline-flex items-center rounded-full px-2.5 py-[3px] text-[12px] font-medium">
                  Pending
                </span>
              </div>
              <button className="text-accent-text w-16 text-left text-[13px] font-medium">
                Resend
              </button>
              <span className="w-6" />
            </div>
          ))}
        </section>
      </div>
    </>
  );
}
