"use client";

import Link from "next/link";
import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BrandMark } from "@/components/ui/logo";
import { requestPasswordReset } from "../actions";

export default function ForgotPasswordPage() {
  const [state, formAction, pending] = useActionState(requestPasswordReset, {});

  return (
    <div className="rounded-card border-border bg-surface w-full max-w-[420px] border p-6">
      <BrandMark size={36} title="Deskolas" />
      <h1 className="text-title text-text mt-4 font-semibold tracking-[-0.01em]">
        Reset your password
      </h1>
      <p className="text-text-2 mt-1 text-[14px]">
        Enter your email and we will send a reset link.
      </p>
      <form className="mt-5 flex flex-col gap-4" action={formAction}>
        <Input
          label="Email"
          name="email"
          type="email"
          placeholder="you@cohort.dev"
          required
        />
        {state.error ? (
          <p className="text-prio-high text-[13px] leading-[18px]">
            {state.error}
          </p>
        ) : null}
        <Button type="submit" className="w-full" loading={pending}>
          Send reset link
        </Button>
      </form>
      <Link
        href="/sign-in"
        className="text-text-2 hover:text-text mt-4 block text-center text-[14px] font-medium"
      >
        Back to sign in
      </Link>
    </div>
  );
}
