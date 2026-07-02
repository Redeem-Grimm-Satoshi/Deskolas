import { Lock } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

// Shown when the invite gate rejects a sign-up, from the password form (which
// passes the attempted email) or from OAuth (which cannot, so the box hides).
export default async function AccessDeniedPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;

  return (
    <div className="rounded-card border-border bg-surface w-full max-w-[420px] border p-6">
      <span className="bg-prio-high/10 flex size-11 items-center justify-center rounded-full">
        <Lock className="text-prio-high size-[22px]" strokeWidth={1.5} />
      </span>
      <h1 className="text-title text-text mt-4 font-semibold tracking-[-0.01em]">
        You need a Per Scholas invite
      </h1>
      <p className="text-text-2 mt-1 text-[14px] leading-6">
        Deskolas is open to the Per Scholas community, by invite. Sign in with
        the email you were invited with, or ask an admin to add you.
      </p>
      {email ? (
        <div className="rounded-control border-border bg-bg mt-5 flex items-center justify-between border px-3 py-2.5">
          <span className="text-text-2 min-w-0 truncate font-mono text-[13px]">
            {email}
          </span>
          <span className="text-text-muted shrink-0 pl-3 text-[12px]">
            not on the list
          </span>
        </div>
      ) : null}
      <Button className="mt-4 w-full" asChild>
        <Link href="/sign-in">Back to sign in</Link>
      </Button>
    </div>
  );
}
