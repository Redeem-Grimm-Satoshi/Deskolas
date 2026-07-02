import { Mail } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

// Landing after an email is sent: account confirmation after sign-up, or a
// password reset link. The sender passes the address and the intent.
export default async function CheckEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; intent?: string }>;
}) {
  const { email, intent } = await searchParams;
  const linkKind =
    intent === "confirm" ? "a confirmation link" : "a reset link";

  return (
    <div className="rounded-card border-border bg-surface w-full max-w-[420px] border p-6">
      <span className="bg-accent-tint flex size-11 items-center justify-center rounded-full">
        <Mail className="text-accent-text size-[22px]" strokeWidth={1.5} />
      </span>
      <h1 className="text-title text-text mt-4 font-semibold tracking-[-0.01em]">
        Check your email
      </h1>
      <p className="text-text-2 mt-1 text-[14px] leading-6">
        We sent {linkKind} to{" "}
        {email ? (
          <span className="text-text font-medium">{email}</span>
        ) : (
          "your email"
        )}
        . Follow it to continue.
      </p>
      <Button variant="secondary" className="mt-5 w-full" asChild>
        <Link href="/sign-in">Back to sign in</Link>
      </Button>
      <p className="text-text-2 mt-4 text-center text-[14px]">
        Didn&apos;t get it? Check your spam folder.
      </p>
    </div>
  );
}
