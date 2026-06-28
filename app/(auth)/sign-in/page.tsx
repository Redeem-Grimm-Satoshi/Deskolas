"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { BrandMark } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { GithubIcon, GoogleIcon } from "@/components/ui/brand-icons";
import { Input } from "@/components/ui/input";

export default function SignInPage() {
  const router = useRouter();

  // Mock sign-in: route to the admin landing. Phase 2 reads the real role and
  // routes admins to the dashboard, learners to my tickets.
  function signIn() {
    router.push("/dashboard");
  }

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
        <div className="flex flex-col gap-2.5">
          <Button variant="secondary" className="w-full" onClick={signIn}>
            <GoogleIcon className="size-4" />
            Continue with Google
          </Button>
          <Button variant="secondary" className="w-full" onClick={signIn}>
            <GithubIcon className="size-4" />
            Continue with GitHub
          </Button>
        </div>

        <div className="my-5 flex items-center gap-3">
          <span className="bg-border h-px flex-1" />
          <span className="text-text-muted text-[12px]">or</span>
          <span className="bg-border h-px flex-1" />
        </div>

        <form
          className="flex flex-col gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            signIn();
          }}
        >
          <Input label="Email" type="email" placeholder="you@cohort.dev" />
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
            <Input id="password" type="password" placeholder="••••••••" />
          </div>
          <Button type="submit" className="w-full">
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
