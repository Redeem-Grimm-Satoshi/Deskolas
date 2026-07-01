"use client";

import Link from "next/link";
import { useActionState } from "react";

import { GithubIcon, GoogleIcon } from "@/components/ui/brand-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BrandMark } from "@/components/ui/logo";
import { signInWithProvider, signUp } from "../actions";

export default function CreateAccountPage() {
  const [state, formAction, pending] = useActionState(signUp, {});

  return (
    <div className="w-full max-w-[420px]">
      <div className="mb-6 flex flex-col items-center gap-3 text-center">
        <BrandMark size={40} title="Deskolas" />
        <div>
          <p className="text-title text-text font-semibold tracking-[-0.01em]">
            Deskolas
          </p>
          <p className="text-text-2 mt-1 text-[14px]">Stuck? Deskolas it.</p>
        </div>
      </div>

      <div className="rounded-card border-border bg-surface border p-6">
        <div className="flex flex-col gap-2.5">
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => signInWithProvider("google")}
          >
            <GoogleIcon className="size-4" />
            Continue with Google
          </Button>
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => signInWithProvider("github")}
          >
            <GithubIcon className="size-4" />
            Continue with GitHub
          </Button>
        </div>

        <div className="my-5 flex items-center gap-3">
          <span className="bg-border h-px flex-1" />
          <span className="text-text-muted text-[12px]">or</span>
          <span className="bg-border h-px flex-1" />
        </div>

        <form className="flex flex-col gap-4" action={formAction}>
          <Input
            label="Full name"
            name="full_name"
            placeholder="Redeem G."
            required
          />
          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="you@cohort.dev"
            required
          />
          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="At least 8 characters"
            required
          />
          {state.error ? (
            <p className="text-prio-high text-[13px] leading-[18px]">
              {state.error}
            </p>
          ) : null}
          <Button type="submit" className="w-full" loading={pending}>
            Create account
          </Button>
        </form>

        <p className="text-text-muted mt-4 text-[12px] leading-[18px]">
          Accounts are invite-only for the Per Scholas community. Admin access
          is granted by an existing admin, not chosen here.
        </p>
      </div>

      <p className="text-text-2 mt-6 text-center text-[14px]">
        Already have an account?{" "}
        <Link href="/sign-in" className="text-accent-text font-medium">
          Sign in
        </Link>
      </p>
    </div>
  );
}
