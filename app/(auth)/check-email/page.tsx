"use client";

import { Mail } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function CheckEmailPage() {
  return (
    <div className="rounded-card border-border bg-surface w-full max-w-[420px] border p-6">
      <span className="bg-accent-tint flex size-11 items-center justify-center rounded-full">
        <Mail className="text-accent-text size-[22px]" strokeWidth={1.5} />
      </span>
      <h1 className="text-title text-text mt-4 font-semibold tracking-[-0.01em]">
        Check your email
      </h1>
      <p className="text-text-2 mt-1 text-[14px] leading-6">
        We sent a reset link to{" "}
        <span className="text-text font-medium">redeem@cohort.dev</span>. The
        link expires in 30 minutes.
      </p>
      <Button variant="secondary" className="mt-5 w-full" asChild>
        <Link href="/sign-in">Back to sign in</Link>
      </Button>
      <p className="text-text-2 mt-4 text-center text-[14px]">
        Didn&apos;t get it?{" "}
        <button className="text-accent-text font-medium">Resend link</button>
      </p>
    </div>
  );
}
