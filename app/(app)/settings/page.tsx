"use client";

import { Lock, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

import { AppTopBar } from "@/components/app/app-top-bar";
import { useSession } from "@/components/providers/session-provider";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
import { useToast } from "@/components/ui/toast";

function Card({ children }: { children: React.ReactNode }) {
  return (
    <section className="rounded-card border-border bg-surface border p-5">
      {children}
    </section>
  );
}

export default function SettingsPage() {
  const { user, role } = useSession();
  const router = useRouter();
  const toast = useToast();

  return (
    <>
      <AppTopBar title="Settings" />
      <div className="mx-auto flex w-full max-w-[640px] flex-col gap-5 p-6 max-sm:p-4">
        <h1 className="text-title text-text font-semibold tracking-[-0.01em]">
          Your profile
        </h1>

        <Card>
          <div className="flex items-center gap-4">
            <Avatar name={user.fullName} size={56} />
            <div>
              <Button variant="secondary">Change photo</Button>
              <p className="text-text-muted mt-1.5 text-[12px]">
                JPG or PNG, under 2 MB.
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-4">
            <Input label="Full name" defaultValue={user.fullName} />
            <div>
              <Input
                label="Email"
                defaultValue={user.email}
                readOnly
                leadingIcon={Lock}
                className="text-text-2"
              />
              <p className="text-text-muted mt-1.5 text-[12px]">
                Managed by your cohort account. Contact an admin to change it.
              </p>
            </div>
          </div>

          <div className="border-border mt-5 flex items-center justify-between border-t pt-4">
            <span className="text-text-2 flex items-center gap-2 text-[13px]">
              Role
              <span className="bg-hover-surface text-text inline-flex items-center rounded-full px-2.5 py-[3px] text-[12px] font-medium capitalize">
                {role}
              </span>
            </span>
            <Button onClick={() => toast({ message: "Profile saved" })}>
              Save changes
            </Button>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-text text-[14px] font-semibold">Password</h2>
              <p className="text-text-2 mt-0.5 text-[13px]">
                We will email you a secure reset link.
              </p>
            </div>
            <Button
              variant="secondary"
              onClick={() => router.push("/forgot-password")}
            >
              Change password
            </Button>
          </div>
        </Card>

        <Card>
          <h2 className="text-text text-[14px] font-semibold">Notifications</h2>
          <div className="mt-4 flex flex-col gap-4">
            {[
              { label: "A ticket is assigned to me", on: true },
              { label: "My ticket changes status", on: true },
              { label: "Weekly cohort summary email", on: false },
            ].map((row) => (
              <label
                key={row.label}
                className="text-text flex items-center justify-between text-[14px]"
              >
                {row.label}
                <Toggle defaultChecked={row.on} aria-label={row.label} />
              </label>
            ))}
          </div>
        </Card>

        <button
          type="button"
          onClick={() => router.push("/sign-in")}
          className="text-prio-high flex items-center gap-1.5 self-end text-[14px] font-medium"
        >
          <LogOut className="size-4" strokeWidth={1.5} />
          Sign out
        </button>
      </div>
    </>
  );
}
