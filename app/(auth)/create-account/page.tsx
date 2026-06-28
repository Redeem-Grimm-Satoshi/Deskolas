"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { GithubIcon, GoogleIcon } from "@/components/ui/brand-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BrandMark } from "@/components/ui/logo";

export default function CreateAccountPage() {
  const router = useRouter();

  function createAccount() {
    router.push("/my-tickets");
  }

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
            onClick={createAccount}
          >
            <GoogleIcon className="size-4" />
            Continue with Google
          </Button>
          <Button
            variant="secondary"
            className="w-full"
            onClick={createAccount}
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

        <form
          className="flex flex-col gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            createAccount();
          }}
        >
          <Input label="Full name" placeholder="Redeem G." />
          <Input label="Email" type="email" placeholder="you@cohort.dev" />
          <Input
            label="Password"
            type="password"
            placeholder="At least 8 characters"
          />
          <Button type="submit" className="w-full">
            Create account
          </Button>
        </form>

        <p className="text-text-muted mt-4 text-[12px] leading-[18px]">
          Accounts are for cohort members. Admin access is granted by an
          existing admin, not chosen here.
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
