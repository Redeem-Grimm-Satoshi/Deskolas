import { SearchX } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="bg-bg flex min-h-dvh items-center justify-center px-4">
      <div className="rounded-card border-border bg-surface flex max-w-md flex-col items-center border px-8 py-12 text-center">
        <span className="rounded-card bg-hover-surface flex size-12 items-center justify-center">
          <SearchX className="text-text-muted size-[22px]" strokeWidth={1.5} />
        </span>
        <p className="text-accent-text mt-5 font-mono text-[13px] tabular-nums">
          404
        </p>
        <h1 className="text-title text-text mt-1 font-semibold tracking-[-0.01em]">
          We can&apos;t find that ticket
        </h1>
        <p className="text-text-2 mt-2 text-[14px] leading-6">
          It may have been closed, or the link is wrong. The ticket ID does not
          match anything in this cohort.
        </p>
        <Button className="mt-6" asChild>
          <Link href="/tickets">Back to tickets</Link>
        </Button>
      </div>
    </main>
  );
}
