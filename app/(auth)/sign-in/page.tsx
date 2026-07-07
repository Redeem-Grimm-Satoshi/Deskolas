"use client";

import Link from "next/link";
import { useActionState } from "react";

import { GoogleIcon } from "@/components/ui/brand-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BrandMark } from "@/components/ui/logo";
import { signIn, signInWithGoogle } from "../actions";

export default function SignInPage() {
  const [state, formAction, pending] = useActionState(signIn, {});

  return (
    <div className="w-full max-w-[420px]">
      <div className="mb-6 flex flex-col items-center gap-3 text-center">
        <BrandMark size={40} title="Deskolas" />
        <div>
          <p className="text-title text-text font-semibold tracking-[-0.01em]">
            Deskolas
          </p>
          <p className="text-text-2 mt-1 text-[14px]">The cohort help desk.</p>
        </div>
      </div>

      <div className="rounded-card border-border bg-surface border p-6">
        <Button
          variant="secondary"
          className="w-full"
          onClick={() => signInWithGoogle()}
        >
          <GoogleIcon className="size-4" />
          Continue with Google
        </Button>

        <div className="my-5 flex items-center gap-3">
          <span className="bg-border h-px flex-1" />
          <span className="text-text-muted text-[12px]">or</span>
          <span className="bg-border h-px flex-1" />
        </div>

        <form className="flex flex-col gap-4" action={formAction}>
          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="you@example.com"
            required
          />
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label
                htmlFor="password"
                className="text-text-2 text-[12px] leading-4 font-medium"
              >
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-accent-text text-[12px] font-medium"
              >
                Forgot password?
              </Link>
            </div>
            <Input id="password" name="password" type="password" required />
          </div>
          {state.error ? (
            <p className="text-prio-high text-[13px] leading-[18px]">
              {state.error}
            </p>
          ) : null}
          <Button type="submit" className="w-full" loading={pending}>
            Sign in
          </Button>
        </form>
      </div>

      <p className="text-text-2 mt-6 text-center text-[14px]">
        New to the cohort?{" "}
        <Link href="/create-account" className="text-accent-text font-medium">
          Create an account
        </Link>
      </p>
    </div>
  );
}
