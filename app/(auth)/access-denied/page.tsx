"use client";

import { Lock } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function AccessDeniedPage() {
  return (
    <div className="rounded-card border-border bg-surface w-full max-w-[420px] border p-6">
      <span className="bg-prio-high/10 flex size-11 items-center justify-center rounded-full">
        <Lock className="text-prio-high size-[22px]" strokeWidth={1.5} />
      </span>
      <h1 className="text-title text-text mt-4 font-semibold tracking-[-0.01em]">
        You need a cohort invite
      </h1>
      <p className="text-text-2 mt-1 text-[14px] leading-6">
        Deskolas is limited to the{" "}
        <span className="text-text font-mono">2026-RTT-23</span> cohort. Sign in
        with your Per Scholas email, or ask an admin to send you an invite.
      </p>
      <div className="rounded-control border-border bg-bg mt-5 flex items-center justify-between border px-3 py-2.5">
        <span className="text-text-2 font-mono text-[13px]">
          redeem@gmail.com
        </span>
        <span className="text-text-muted text-[12px]">not on the list</span>
      </div>
      <Button className="mt-4 w-full" asChild>
        <Link href="/sign-in">Back to sign in</Link>
      </Button>
    </div>
  );
}
