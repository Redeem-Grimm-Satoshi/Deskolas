"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BrandMark } from "@/components/ui/logo";

export default function ForgotPasswordPage() {
  const router = useRouter();

  return (
    <div className="rounded-card border-border bg-surface w-full max-w-[420px] border p-6">
      <BrandMark size={36} title="Deskolas" />
      <h1 className="text-title text-text mt-4 font-semibold tracking-[-0.01em]">
        Reset your password
      </h1>
      <p className="text-text-2 mt-1 text-[14px]">
        Enter your email and we will send a reset link.
      </p>
      <form
        className="mt-5 flex flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          router.push("/check-email");
        }}
      >
        <Input label="Email" type="email" placeholder="you@cohort.dev" />
        <Button type="submit" className="w-full">
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
