"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BrandMark } from "@/components/ui/logo";

export default function SetNewPasswordPage() {
  const router = useRouter();

  return (
    <div className="rounded-card border-border bg-surface w-full max-w-[420px] border p-6">
      <BrandMark size={36} title="Deskolas" />
      <h1 className="text-title text-text mt-4 font-semibold tracking-[-0.01em]">
        Set a new password
      </h1>
      <p className="text-text-2 mt-1 text-[14px]">
        Choose a password you have not used before.
      </p>
      <form
        className="mt-5 flex flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          router.push("/sign-in");
        }}
      >
        <Input
          label="New password"
          type="password"
          placeholder="At least 8 characters"
        />
        <Input
          label="Confirm password"
          type="password"
          placeholder="Re-enter password"
        />
        <Button type="submit" className="w-full">
          Update password
        </Button>
      </form>
    </div>
  );
}
