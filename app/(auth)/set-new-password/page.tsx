"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BrandMark } from "@/components/ui/logo";
import { updatePassword } from "../actions";

export default function SetNewPasswordPage() {
  const [state, formAction, pending] = useActionState(updatePassword, {});

  return (
    <div className="rounded-card border-border bg-surface w-full max-w-[420px] border p-6">
      <BrandMark size={36} title="Deskolas" />
      <h1 className="text-title text-text mt-4 font-semibold tracking-[-0.01em]">
        Set a new password
      </h1>
      <p className="text-text-2 mt-1 text-[14px]">
        Choose a password you have not used before.
      </p>
      <form className="mt-5 flex flex-col gap-4" action={formAction}>
        <Input
          label="New password"
          name="password"
          type="password"
          placeholder="At least 8 characters"
          required
        />
        <Input
          label="Confirm password"
          name="confirm"
          type="password"
          placeholder="Re-enter password"
          required
        />
        {state.error ? (
          <p className="text-prio-high text-[13px] leading-[18px]">
            {state.error}
          </p>
        ) : null}
        <Button type="submit" className="w-full" loading={pending}>
          Update password
        </Button>
      </form>
    </div>
  );
}
