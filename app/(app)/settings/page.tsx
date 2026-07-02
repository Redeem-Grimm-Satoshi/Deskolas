"use client";

import { Lock, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";

import { signOut } from "@/app/(auth)/actions";
import { updateProfileAvatar, updateProfileName } from "@/app/(app)/actions";
import { AppTopBar } from "@/components/app/app-top-bar";
import { useSession } from "@/components/providers/session-provider";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
import { useToast } from "@/components/ui/toast";
import { createClient } from "@/lib/supabase/client";
import { ROLE_LABELS } from "@/lib/tickets";

const MAX_AVATAR_BYTES = 2 * 1024 * 1024;
const AVATAR_TYPES: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
};

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
  const [name, setName] = React.useState(user.fullName);
  const [saving, setSaving] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  async function save() {
    setSaving(true);
    const result = await updateProfileName(name);
    setSaving(false);
    toast({ message: result.error ?? "Profile saved" });
    router.refresh();
  }

  async function uploadAvatar(file: File) {
    const ext = AVATAR_TYPES[file.type];
    if (!ext) {
      toast({ message: "Use a JPG or PNG image." });
      return;
    }
    if (file.size > MAX_AVATAR_BYTES) {
      toast({ message: "That image is too large. Use one under 2 MB." });
      return;
    }

    setUploading(true);
    const supabase = createClient();
    // A timestamped name sidesteps CDN caching of a replaced image; the old
    // files are cleaned up best effort.
    const path = `${user.id}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage
      .from("avatars")
      .upload(path, file, { contentType: file.type });

    if (error) {
      setUploading(false);
      toast({ message: "Could not upload the photo. Try again." });
      return;
    }

    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    const result = await updateProfileAvatar(data.publicUrl);

    const { data: existing } = await supabase.storage
      .from("avatars")
      .list(user.id);
    const stale = (existing ?? [])
      .filter((item) => `${user.id}/${item.name}` !== path)
      .map((item) => `${user.id}/${item.name}`);
    if (stale.length > 0) {
      await supabase.storage.from("avatars").remove(stale);
    }

    setUploading(false);
    toast({ message: result.error ?? "Photo updated" });
    router.refresh();
  }

  return (
    <>
      <AppTopBar title="Settings" />
      <div className="mx-auto flex w-full max-w-[640px] flex-col gap-5 p-6 max-sm:p-4">
        <h1 className="text-title text-text font-semibold tracking-[-0.01em]">
          Your profile
        </h1>

        <Card>
          <div className="flex items-center gap-4">
            <Avatar name={user.fullName} src={user.avatarUrl} size={56} />
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) uploadAvatar(file);
                  event.target.value = "";
                }}
              />
              <Button
                variant="secondary"
                loading={uploading}
                loadingText="Uploading"
                onClick={() => fileInputRef.current?.click()}
              >
                Change photo
              </Button>
              <p className="text-text-muted mt-1.5 text-[12px]">
                JPG or PNG, under 2 MB.
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-4">
            <Input
              label="Full name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
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
              <span className="bg-hover-surface text-text inline-flex items-center rounded-full px-2.5 py-[3px] text-[12px] font-medium">
                {ROLE_LABELS[role]}
              </span>
            </span>
            <Button onClick={save} loading={saving}>
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
          onClick={() => signOut()}
          className="text-prio-high flex items-center gap-1.5 self-end text-[14px] font-medium"
        >
          <LogOut className="size-4" strokeWidth={1.5} />
          Sign out
        </button>
      </div>
    </>
  );
}
